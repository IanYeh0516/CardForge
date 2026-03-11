from flask import Blueprint, render_template, request, redirect, url_for, jsonify

import config
import db
from services.excel_service import parse_excel
import os

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
    data_keys = list(config.DEFAULT_DATA_COLUMNS)
    for emp in employees:
        for k in emp.get('field_data', {}):
            if k not in data_keys:
                data_keys.append(k)
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


@session_bp.route('/session/<int:session_id>', methods=['DELETE'])
def delete_session(session_id):
    db.delete_session(session_id)
    return jsonify(ok=True)
