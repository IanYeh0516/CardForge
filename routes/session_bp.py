from flask import Blueprint, render_template, request, redirect, url_for, jsonify

import config
import db
from services.excel_service import parse_excel
import os
import re
import json

session_bp = Blueprint('session', __name__)


@session_bp.route('/')
def index():
    sessions = db.get_sessions()
    if len(sessions) == 1:
        return redirect(url_for('session.editor', session_id=sessions[0]['id']))
    if len(sessions) == 0:
        session_id = db.create_session('Untitled Session')
        return redirect(url_for('session.editor', session_id=session_id))
    return render_template('index.html', sessions=sessions)


@session_bp.route('/session/<int:session_id>')
def editor(session_id):
    session = db.get_session(session_id)
    if not session:
        return redirect(url_for('session.index'))
    employees = db.get_employees(session_id)
    card_config = db.get_card_config(session_id)
    # Build table columns from actual employee data; fall back to defaults if empty
    data_keys = []
    for emp in employees:
        for k in emp.get('field_data', {}):
            if k not in data_keys:
                data_keys.append(k)
    if not data_keys:
        data_keys = list(config.DEFAULT_DATA_COLUMNS)
    return render_template('editor.html', session=session, employees=employees,
                           card_config=card_config, field_keys=data_keys)


@session_bp.route('/session', methods=['POST'])
def create_session():
    name = request.form.get('name', '').strip()
    if not name:
        name = 'Untitled Session'
    session_id = db.create_session(name)
    return redirect(url_for('session.editor', session_id=session_id))


@session_bp.route('/upload', methods=['POST'])
def upload_excel():
    file = request.files.get('file')
    if not file or not file.filename.endswith('.xlsx'):
        return jsonify(error='Please upload a .xlsx file'), 400

    try:
        headers, rows = parse_excel(file.stream)
    except ValueError as e:
        return jsonify(error=str(e)), 400

    session_name = os.path.splitext(file.filename)[0]
    session_id = db.create_session(session_name, source_file=file.filename)

    card_config = db.get_card_config(session_id)
    layout = card_config['field_layout']
    if not layout:
        y_pos = 30
        for header in headers:
            layout.append({
                "key": header, "label": header,
                "x": 50, "y": y_pos, "font_size": 14,
                "color": "#333333", "align": "center", "bold": False, "font": "NotoSansTC"
            })
            y_pos += 12
        db.save_card_config(session_id, field_layout=layout)

    for row in rows:
        db.add_employee(session_id, row)

    return redirect(url_for('session.editor', session_id=session_id))


@session_bp.route('/upload/<int:session_id>/preview', methods=['POST'])
def preview_import(session_id):
    """Parse Excel and return headers + auto-mapping suggestions."""
    file = request.files.get('file')
    if not file or not file.filename.endswith('.xlsx'):
        return jsonify(error='Please upload a .xlsx file'), 400

    try:
        headers, rows = parse_excel(file.stream)
    except ValueError as e:
        return jsonify(error=str(e)), 400

    # Extract all keys referenced by layout (field.key + template placeholders)
    card_config = db.get_card_config(session_id)
    layout = card_config['field_layout'] if card_config else []
    layout_keys_list = []
    seen = set()
    for field in layout:
        k = field['key']
        if k not in seen:
            layout_keys_list.append(k)
            seen.add(k)
        tmpl = field.get('template', '')
        if tmpl:
            for tk in re.findall(r'\{([^}]+)\}', tmpl):
                if tk not in seen:
                    layout_keys_list.append(tk)
                    seen.add(tk)

    # Three-round auto-mapping
    layout_keys_lower = {k.lower(): k for k in layout_keys_list}
    matched_layout_keys = set()
    auto_map = {}
    match_type = {}

    # Round 1+2: exact name / case-insensitive
    for h in headers:
        if h in seen:
            auto_map[h] = h
            match_type[h] = 'name'
            matched_layout_keys.add(h)
        elif h.lower() in layout_keys_lower:
            mapped = layout_keys_lower[h.lower()]
            auto_map[h] = mapped
            match_type[h] = 'name'
            matched_layout_keys.add(mapped)
        else:
            auto_map[h] = None
            match_type[h] = None

    # Round 3: positional fallback
    unmatched_headers = [h for h in headers if auto_map[h] is None]
    unmatched_layout = [k for k in layout_keys_list if k not in matched_layout_keys]
    for i, h in enumerate(unmatched_headers):
        if i < len(unmatched_layout):
            auto_map[h] = unmatched_layout[i]
            match_type[h] = 'position'

    # Temp-save parsed rows
    tmp_path = os.path.join(config.DATA_DIR, f'tmp_{session_id}.json')
    with open(tmp_path, 'w', encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False)

    return jsonify(
        headers=headers,
        layout_keys=layout_keys_list,
        auto_map=auto_map,
        match_type=match_type,
        row_count=len(rows)
    )


@session_bp.route('/upload/<int:session_id>/confirm', methods=['POST'])
def confirm_import(session_id):
    """Apply user-confirmed mapping and save employees."""
    data = request.get_json()
    mapping = data.get('mapping', {})  # {excel_header: layout_key or null}

    tmp_path = os.path.join(config.DATA_DIR, f'tmp_{session_id}.json')
    if not os.path.exists(tmp_path):
        return jsonify(error='No preview data found. Please re-upload.'), 400

    with open(tmp_path, 'r', encoding='utf-8') as f:
        rows = json.load(f)
    os.remove(tmp_path)

    card_config = db.get_card_config(session_id)
    layout = card_config['field_layout'] if card_config else []

    # Build reverse map: old layout key → new Excel header
    reverse_map = {v: k for k, v in mapping.items() if v}

    if not layout:
        # Empty session: auto-generate layout from Excel headers
        layout = []
        y_pos = 30
        for excel_header, layout_key in mapping.items():
            if layout_key:
                layout.append({
                    "key": excel_header, "label": excel_header,
                    "x": 50, "y": y_pos, "font_size": 14,
                    "color": "#333333", "align": "center", "bold": False, "font": "NotoSansTC"
                })
                y_pos += 12
    else:
        # Update layout: replace old keys/labels with Excel headers
        for field in layout:
            old_key = field['key']
            if old_key in reverse_map:
                field['key'] = reverse_map[old_key]
                field['label'] = reverse_map[old_key]
            # Update template placeholders: {old_key} → {excel_header}
            tmpl = field.get('template', '')
            if tmpl:
                for old_k, new_k in reverse_map.items():
                    tmpl = tmpl.replace(f'{{{old_k}}}', f'{{{new_k}}}')
                field['template'] = tmpl

    db.save_card_config(session_id, field_layout=layout)

    # Clear old employees, add new with original Excel headers
    db.delete_employees_by_session(session_id)
    for row in rows:
        db.add_employee(session_id, row)

    return jsonify(ok=True, count=len(rows))


@session_bp.route('/session/<int:session_id>', methods=['DELETE'])
def delete_session(session_id):
    db.delete_session(session_id)
    return jsonify(ok=True)
