import json
import os
import sqlite3
from datetime import datetime

import config


def get_db():
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            source_file TEXT DEFAULT '',
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            field_data TEXT NOT NULL DEFAULT '{}',
            sort_order INTEGER DEFAULT 0,
            FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS card_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL UNIQUE,
            card_width REAL NOT NULL,
            card_height REAL NOT NULL,
            dpi INTEGER NOT NULL,
            front_template TEXT DEFAULT '',
            back_template TEXT DEFAULT '',
            field_layout TEXT NOT NULL DEFAULT '[]',
            bg_color TEXT DEFAULT '#FFFFFF',
            FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
        );
    """)
    conn.commit()
    conn.close()


def _row_to_dict(row):
    if row is None:
        return None
    return dict(row)


def _parse_employee(row):
    d = _row_to_dict(row)
    if d and 'field_data' in d:
        d['field_data'] = json.loads(d['field_data'])
    return d


def _parse_config(row):
    d = _row_to_dict(row)
    if d and 'field_layout' in d:
        d['field_layout'] = json.loads(d['field_layout'])
    return d


# --- Sessions ---

def create_session(name, source_file=''):
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO sessions (name, source_file, created_at) VALUES (?, ?, ?)",
        (name, source_file, datetime.now().isoformat())
    )
    session_id = cur.lastrowid
    # Use layout_preset.json as default layout if it exists
    preset_path = os.path.join(config.DATA_DIR, 'layout_preset.json')
    if os.path.isfile(preset_path):
        with open(preset_path, 'r', encoding='utf-8') as _f:
            default_layout = json.load(_f).get('field_layout', config.DEFAULT_FIELD_LAYOUT)
    else:
        default_layout = config.DEFAULT_FIELD_LAYOUT

    # Create default card config for this session
    conn.execute(
        "INSERT INTO card_configs (session_id, card_width, card_height, dpi, field_layout, front_template, back_template) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (session_id, config.CARD_WIDTH_INCHES, config.CARD_HEIGHT_INCHES,
         config.PRINT_DPI, json.dumps(default_layout, ensure_ascii=False),
         config.DEFAULT_FRONT_TEMPLATE, config.DEFAULT_BACK_TEMPLATE)
    )
    conn.commit()
    conn.close()
    return session_id


def get_sessions():
    conn = get_db()
    rows = conn.execute("""
        SELECT s.*, COUNT(e.id) as employee_count
        FROM sessions s
        LEFT JOIN employees e ON e.session_id = s.id
        GROUP BY s.id
        ORDER BY s.created_at DESC
    """).fetchall()
    conn.close()
    return [_row_to_dict(r) for r in rows]


def get_session(session_id):
    conn = get_db()
    row = conn.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
    conn.close()
    return _row_to_dict(row)


def delete_session(session_id):
    conn = get_db()
    conn.execute("DELETE FROM sessions WHERE id = ?", (session_id,))
    conn.commit()
    conn.close()


# --- Employees ---

def add_employee(session_id, field_data):
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO employees (session_id, field_data) VALUES (?, ?)",
        (session_id, json.dumps(field_data, ensure_ascii=False))
    )
    eid = cur.lastrowid
    conn.commit()
    conn.close()
    return eid


def get_employees(session_id):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM employees WHERE session_id = ? ORDER BY sort_order, id",
        (session_id,)
    ).fetchall()
    conn.close()
    return [_parse_employee(r) for r in rows]


def get_employee(employee_id):
    conn = get_db()
    row = conn.execute("SELECT * FROM employees WHERE id = ?", (employee_id,)).fetchone()
    conn.close()
    return _parse_employee(row)


def update_employee(employee_id, field_data):
    conn = get_db()
    conn.execute(
        "UPDATE employees SET field_data = ? WHERE id = ?",
        (json.dumps(field_data, ensure_ascii=False), employee_id)
    )
    conn.commit()
    conn.close()


def delete_employee(employee_id):
    conn = get_db()
    conn.execute("DELETE FROM employees WHERE id = ?", (employee_id,))
    conn.commit()
    conn.close()


# --- Card Config ---

def get_card_config(session_id):
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM card_configs WHERE session_id = ?", (session_id,)
    ).fetchone()
    conn.close()
    return _parse_config(row)


def save_card_config(session_id, **kwargs):
    conn = get_db()
    existing = conn.execute(
        "SELECT id FROM card_configs WHERE session_id = ?", (session_id,)
    ).fetchone()

    if 'field_layout' in kwargs and isinstance(kwargs['field_layout'], list):
        kwargs['field_layout'] = json.dumps(kwargs['field_layout'], ensure_ascii=False)

    if existing:
        sets = ', '.join(f"{k} = ?" for k in kwargs)
        vals = list(kwargs.values()) + [session_id]
        conn.execute(f"UPDATE card_configs SET {sets} WHERE session_id = ?", vals)
    else:
        kwargs.setdefault('card_width', config.CARD_WIDTH_INCHES)
        kwargs.setdefault('card_height', config.CARD_HEIGHT_INCHES)
        kwargs.setdefault('dpi', config.PRINT_DPI)
        kwargs.setdefault('field_layout', json.dumps(config.DEFAULT_FIELD_LAYOUT, ensure_ascii=False))
        cols = ', '.join(['session_id'] + list(kwargs.keys()))
        placeholders = ', '.join(['?'] * (len(kwargs) + 1))
        vals = [session_id] + list(kwargs.values())
        conn.execute(f"INSERT INTO card_configs ({cols}) VALUES ({placeholders})", vals)

    conn.commit()

    # Also write the full config to a JSON file for portability
    row = conn.execute("SELECT * FROM card_configs WHERE session_id = ?", (session_id,)).fetchone()
    conn.close()
    if row:
        cfg = dict(row)
        cfg['field_layout'] = json.loads(cfg['field_layout'])
        json_path = os.path.join(config.DATA_DIR, f'session_{session_id}_config.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(cfg, f, ensure_ascii=False, indent=2)
