import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Card dimensions (90 x 54 mm)
CARD_WIDTH_MM = 90
CARD_HEIGHT_MM = 54
PRINT_DPI = 300
PREVIEW_DPI = 150

# Convert mm to inches for rendering
CARD_WIDTH_INCHES = CARD_WIDTH_MM / 25.4   # ~3.543
CARD_HEIGHT_INCHES = CARD_HEIGHT_MM / 25.4  # ~2.126

# Pixel dimensions at print quality
CARD_WIDTH_PX = int(CARD_WIDTH_INCHES * PRINT_DPI)   # 1063
CARD_HEIGHT_PX = int(CARD_HEIGHT_INCHES * PRINT_DPI)  # 638

# Directories
DATA_DIR = os.path.join(BASE_DIR, 'data')
DB_PATH = os.path.join(DATA_DIR, 'namecard.db')
EXPORTS_DIR = os.path.join(DATA_DIR, 'exports')
TEMPLATES_DIR = os.path.join(BASE_DIR, 'asset')
FONTS_DIR = os.path.join(BASE_DIR, 'static', 'fonts')

# Ensure directories exist
for d in [DATA_DIR, EXPORTS_DIR, FONTS_DIR]:
    os.makedirs(d, exist_ok=True)

# Default field layout for back side
# Each field: {key, label, x, y, font_size, color, align}
# x, y are percentages of card dimensions (0-100)
# Positions based on Back.png reference (backtemplate.png as background)
# x, y = percentage from top-left; align=left means x is the left edge of text
SUPPORTED_FONTS = [
    {"key": "NotoSansTC", "label": "Noto Sans TC"},
    {"key": "MavenPro",   "label": "Maven Pro"},
]

# Data columns shown in the employee table (actual stored keys)
DEFAULT_DATA_COLUMNS = ["ID", "Name", "English Name", "Department", "Title", "Ext", "Dept (EN)", "Title (EN)", "Email", "Mobile"]

# Card layout fields — "template" fields interpolate {key} placeholders from employee data
DEFAULT_FIELD_LAYOUT = [
    {"key": "Name",        "label": "Name",        "x": 6.9,  "y": 7.6,  "font_size": 35, "color": "#454c4f", "align": "left",   "bold": True,  "font": "NotoSansTC"},
    {"key": "English Name","label": "English Name", "x": 6.9,  "y": 18.2, "font_size": 21, "color": "#454c4f", "align": "left",   "bold": False, "font": "MavenPro"},
    {"key": "Dept_Title",  "label": "Dept | Title", "template": "{Department} | {Title}",
                            "x": 51.8, "y": 7.6,  "font_size": 28, "color": "#454c4f", "align": "left",   "bold": False, "font": "NotoSansTC"},
    {"key": "Ext",         "label": "Ext",          "x": 71.5, "y": 80.8, "font_size": 19, "color": "#454c4f", "align": "left",   "bold": False, "font": "NotoSansTC"},
    {"key": "Dept (EN)",   "label": "Dept (EN)",    "x": 51.8, "y": 16.9, "font_size": 21, "color": "#454c4f", "align": "center", "bold": False, "font": "MavenPro"},
    {"key": "Title (EN)",  "label": "Title (EN)",   "x": 51.8, "y": 23.0, "font_size": 21, "color": "#454c4f", "align": "center", "bold": False, "font": "MavenPro"},
    {"key": "Mobile",      "label": "Mobile",       "x": 51.7, "y": 74.7, "font_size": 19, "color": "#454c4f", "align": "left",   "bold": False, "font": "NotoSansTC"},
    {"key": "Email",       "label": "Email",        "x": 51.8, "y": 87.3, "font_size": 19, "color": "#454c4f", "align": "left",   "bold": False, "font": "MavenPro"},
]

DEFAULT_FRONT_TEMPLATE = "front.png"
DEFAULT_BACK_TEMPLATE  = "back.png"

# Font fallback chain (filenames relative to FONTS_DIR)
FONT_FALLBACK = [
    "NotoSansTC-Regular.ttf",
    "NotoSansTC-Regular-v39.ttf",
    "NotoSansCJKtc-Black.otf",
    "MavenPro-Regular.ttf",
    "Arial",
]

FONT_BOLD_FALLBACK = [
    "NotoSansTC-Bold.ttf",
    "NotoSansTC-SemiBold.ttf",
    "NotoSansCJKtc-Black.otf",
    "MavenPro-Bold.ttf",
    "Arial Bold",
]

# Maven Pro (Latin only, for English fields)
FONT_LATIN_FALLBACK = [
    "MavenPro-Regular.ttf",
    "MavenPro-Bold.ttf",
]
