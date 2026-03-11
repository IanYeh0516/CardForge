import os
from io import BytesIO

from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.utils import ImageReader

import config
from services.card_renderer import render_front, render_back

# 1 inch = 72 ReportLab points
_INCH_TO_PTS = 72.0


def _page_size_pts(card_config):
    """Return (width_pts, height_pts). card_width/height stored in inches."""
    w = card_config['card_width']
    h = card_config['card_height']
    # Guard: if value looks like mm (>20), convert to inches
    if w > 20:
        w = w / 25.4
    if h > 20:
        h = h / 25.4
    return (w * _INCH_TO_PTS, h * _INCH_TO_PTS)


def _emp_stem(field_data, emp_id):
    """Safe filename stem: ID field → fallback to id."""
    num = str(field_data.get('ID', '')).strip()
    return num if num else str(emp_id)


def _write_employee_pages(c, emp, card_config, dpi, page_w, page_h):
    field_data = emp.get('field_data', emp)

    # Front page
    front_img = render_front(card_config, dpi=dpi)
    buf = BytesIO()
    front_img.save(buf, format='PNG')
    buf.seek(0)
    c.drawImage(ImageReader(buf), 0, 0, width=page_w, height=page_h)
    c.showPage()

    # Back page
    back_img = render_back(field_data, card_config, dpi=dpi)
    buf = BytesIO()
    back_img.save(buf, format='PNG')
    buf.seek(0)
    c.drawImage(ImageReader(buf), 0, 0, width=page_w, height=page_h)
    c.showPage()


def generate_pdf(employees, card_config, selected_ids=None):
    """One PDF per employee (front+back pages), saved directly to exports dir.
    Returns list of saved file paths."""
    if selected_ids:
        employees = [e for e in employees if e['id'] in selected_ids]

    page_w, page_h = _page_size_pts(card_config)
    dpi = card_config.get('dpi', config.PRINT_DPI)

    saved_files = []
    for emp in employees:
        stem = _emp_stem(emp.get('field_data', emp), emp.get('id', 0))
        filepath = os.path.join(config.EXPORTS_DIR, f"{stem}.pdf")
        c = rl_canvas.Canvas(filepath, pagesize=(page_w, page_h))
        _write_employee_pages(c, emp, card_config, dpi, page_w, page_h)
        c.save()
        saved_files.append(filepath)

    return saved_files


def generate_single_pdf(employee, card_config):
    """2-page PDF (front+back) for one employee. Returns filepath."""
    field_data = employee.get('field_data', employee)
    stem = _emp_stem(field_data, employee.get('id', 'x'))
    filepath = os.path.join(config.EXPORTS_DIR, f"{stem}.pdf")

    page_w, page_h = _page_size_pts(card_config)
    dpi = card_config.get('dpi', config.PRINT_DPI)

    c = rl_canvas.Canvas(filepath, pagesize=(page_w, page_h))
    _write_employee_pages(c, employee, card_config, dpi, page_w, page_h)
    c.save()
    return filepath
