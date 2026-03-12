import os
import re
from io import BytesIO

from PIL import Image, ImageDraw, ImageFont, ImageOps

import config

# CSS reference canvas width (matches the 1063px native div in editor)
_CSS_REF_W = 1063

_FONT_CHAINS = {
    "MavenPro":   {"regular": ["MavenPro-Regular.ttf"], "bold": ["MavenPro-Bold.ttf"]},
    "NotoSansTC": {"regular": config.FONT_FALLBACK,     "bold": config.FONT_BOLD_FALLBACK},
}


def _find_font(bold=False, family="NotoSansTC"):
    """Find the first available font from the fallback chain."""
    chain = _FONT_CHAINS.get(family, _FONT_CHAINS["NotoSansTC"])
    fallback = chain["bold"] if bold else chain["regular"]
    if bold:
        fallback = fallback + [f for f in config.FONT_BOLD_FALLBACK if f not in fallback]
    else:
        fallback = fallback + [f for f in config.FONT_FALLBACK if f not in fallback]

    for font_name in fallback:
        font_path = os.path.join(config.FONTS_DIR, font_name)
        if os.path.isfile(font_path):
            return font_path
        system_paths = [
            f"/System/Library/Fonts/{font_name}",
            f"/System/Library/Fonts/Supplemental/{font_name}",
            f"/Library/Fonts/{font_name}",
            os.path.expanduser(f"~/Library/Fonts/{font_name}"),
            f"C:/Windows/Fonts/{font_name}",
            f"/usr/share/fonts/truetype/{font_name}",
            f"/usr/share/fonts/opentype/{font_name}",
        ]
        for sp in system_paths:
            if os.path.isfile(sp):
                return sp
    return None


def _get_font(size, bold=False, family="NotoSansTC"):
    """Get a PIL ImageFont at the given size."""
    path = _find_font(bold, family)
    if path:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    try:
        return ImageFont.truetype("Arial", size)
    except Exception:
        return ImageFont.load_default()


def _hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def _load_template(template_name):
    """Load a template image. Returns PIL Image or None."""
    if not template_name:
        return None
    tpl_path = os.path.join(config.TEMPLATES_DIR, template_name)
    if not os.path.isfile(tpl_path):
        return None
    try:
        return Image.open(tpl_path).convert('RGB')
    except Exception:
        return None


def _draw_fields(img, employee_data, field_layout):
    """Draw text fields on an image. Scale font sizes proportionally to canvas width."""
    w, h = img.size
    scale = w / _CSS_REF_W  # scale factor vs CSS reference canvas

    draw = ImageDraw.Draw(img)

    for field in field_layout:
        key = field['key']
        tmpl = field.get('template', '')
        if tmpl:
            text = re.sub(r'\{([^}]+)\}', lambda m: employee_data.get(m.group(1), ''), tmpl)
            text = text.strip(' ｜').strip()
        else:
            text = employee_data.get(key, '')
        if not text:
            continue

        # Font size: pt → CSS px (pt*96/72), then scale to canvas
        css_px = field.get('font_size', 14) * 96 / 72
        font_size = max(1, int(css_px * scale))
        bold = field.get('bold', False)
        family = field.get('font', 'NotoSansTC')
        font = _get_font(font_size, bold, family)
        color = _hex_to_rgb(field.get('color', '#000000'))

        # Position: top-left corner, percentage of canvas
        x = int(w * field.get('x', 50) / 100)
        y = int(h * field.get('y', 50) / 100)

        draw.text((x, y), text, fill=color, font=font)


def render_back(employee_data, card_config, dpi=None):
    """Render back side at template's native resolution, then resize to target DPI."""
    if dpi is None:
        dpi = card_config.get('dpi', config.PRINT_DPI)

    target_w = int(card_config['card_width'] * dpi)
    target_h = int(card_config['card_height'] * dpi)
    bg_color = card_config.get('bg_color', '#FFFFFF')
    field_layout = card_config.get('field_layout', config.DEFAULT_FIELD_LAYOUT)

    # Load template at full native resolution
    tpl = _load_template(card_config.get('back_template', ''))

    if tpl:
        # If template is larger than target → render at template size (high quality)
        # If template is smaller → upscale template to target first (avoid upscale after text)
        if tpl.size[0] >= target_w:
            img = tpl
        else:
            img = tpl.resize((target_w, target_h), Image.LANCZOS)
    else:
        img = Image.new('RGB', (target_w, target_h), _hex_to_rgb(bg_color))

    # Draw text fields at current canvas resolution
    _draw_fields(img, employee_data, field_layout)

    # Resize to target output size (90mm × 54mm at target DPI)
    if img.size != (target_w, target_h):
        img = img.resize((target_w, target_h), Image.LANCZOS)

    return img


def render_front(card_config, dpi=None):
    """Render front side at template's native resolution, then resize to target DPI."""
    if dpi is None:
        dpi = card_config.get('dpi', config.PRINT_DPI)

    target_w = int(card_config['card_width'] * dpi)
    target_h = int(card_config['card_height'] * dpi)
    bg_color = card_config.get('bg_color', '#FFFFFF')

    tpl = _load_template(card_config.get('front_template', ''))

    if tpl:
        if tpl.size[0] >= target_w:
            img = tpl
        else:
            img = tpl.resize((target_w, target_h), Image.LANCZOS)
    else:
        img = Image.new('RGB', (target_w, target_h), _hex_to_rgb(bg_color))

    if img.size != (target_w, target_h):
        img = img.resize((target_w, target_h), Image.LANCZOS)

    return img


def render_combined(employee_data, card_config, dpi=None):
    """Render front (top) + back (bottom) combined into one image."""
    front = render_front(card_config, dpi=dpi)
    back = render_back(employee_data, card_config, dpi=dpi)
    w, h = front.size
    combined = Image.new('RGB', (w, h * 2))
    combined.paste(front, (0, 0))
    combined.paste(back, (0, h))
    return combined


def render_preview(employee_data, card_config, side='back'):
    """Render a preview, return JPEG bytes."""
    if side == 'front':
        img = render_front(card_config, dpi=config.PREVIEW_DPI)
    else:
        img = render_back(employee_data, card_config, dpi=config.PREVIEW_DPI)

    buf = BytesIO()
    img.save(buf, format='JPEG', quality=85)
    buf.seek(0)
    return buf.getvalue()
