import os
import platform
import subprocess
from io import BytesIO

from flask import Blueprint, request, jsonify, send_file

import config
import db
from services.card_renderer import render_preview, render_back
from services.pdf_service import generate_pdf, generate_single_pdf

export_bp = Blueprint('export', __name__)


@export_bp.route('/preview/<int:employee_id>')
def preview(employee_id):
    side = request.args.get('side', 'back')
    emp = db.get_employee(employee_id)
    if not emp:
        return 'Not found', 404
    card_config = db.get_card_config(emp['session_id'])
    jpeg_bytes = render_preview(emp['field_data'], card_config, side=side)
    return send_file(BytesIO(jpeg_bytes), mimetype='image/jpeg')


@export_bp.route('/preview/blank/<int:session_id>')
def preview_blank(session_id):
    card_config = db.get_card_config(session_id)
    if not card_config:
        return 'Not found', 404
    jpeg_bytes = render_preview({}, card_config, side='back')
    return send_file(BytesIO(jpeg_bytes), mimetype='image/jpeg')


@export_bp.route('/preview/front/<int:session_id>')
def preview_front(session_id):
    card_config = db.get_card_config(session_id)
    if not card_config:
        return 'Not found', 404
    jpeg_bytes = render_preview({}, card_config, side='front')
    return send_file(BytesIO(jpeg_bytes), mimetype='image/jpeg')


@export_bp.route('/export/pdf/<int:session_id>', methods=['POST'])
def export_pdf(session_id):
    employees = db.get_employees(session_id)
    if not employees:
        return jsonify(error='No employee data'), 404
    card_config = db.get_card_config(session_id)
    data = request.get_json() or {}
    selected_ids = set(data['ids']) if data.get('ids') else None
    saved_files = generate_pdf(employees, card_config, selected_ids=selected_ids)
    filenames = [os.path.basename(f) for f in saved_files]
    return jsonify(ok=True, count=len(filenames), files=filenames)


@export_bp.route('/export/jpg/<int:session_id>', methods=['POST'])
def export_jpg(session_id):
    employees = db.get_employees(session_id)
    if not employees:
        return jsonify(error='No employee data'), 404
    card_config = db.get_card_config(session_id)
    dpi = card_config.get('dpi', config.PRINT_DPI)

    data = request.get_json() or {}
    selected_ids = set(data['ids']) if data.get('ids') else None
    if selected_ids:
        employees = [e for e in employees if e['id'] in selected_ids]

    saved_files = []
    for emp in employees:
        field_data = emp['field_data']
        stem = str(field_data.get('ID', '')).strip() or str(emp['id'])
        back_img = render_back(field_data, card_config, dpi=dpi)
        back_path = os.path.join(config.EXPORTS_DIR, f'{stem}.jpg')
        back_img.save(back_path, format='JPEG', quality=95, dpi=(dpi, dpi))
        saved_files.append(back_path)

    filenames = [os.path.basename(f) for f in saved_files]
    return jsonify(ok=True, count=len(filenames), files=filenames)


@export_bp.route('/export/excel/<int:session_id>', methods=['POST'])
def export_excel(session_id):
    from openpyxl import Workbook

    employees = db.get_employees(session_id)
    if not employees:
        return jsonify(error='No employee data'), 404

    data = request.get_json() or {}
    selected_ids = set(data['ids']) if data.get('ids') else None
    if selected_ids:
        employees = [e for e in employees if e['id'] in selected_ids]

    all_keys = list(config.DEFAULT_DATA_COLUMNS)
    for emp in employees:
        for k in emp.get('field_data', {}):
            if k not in all_keys:
                all_keys.append(k)

    wb = Workbook()
    ws = wb.active
    ws.title = 'Employees'
    ws.append(all_keys)
    for emp in employees:
        fd = emp.get('field_data', {})
        ws.append([fd.get(k, '') for k in all_keys])

    session = db.get_session(session_id)
    name = session['name'] if session else 'employees'
    filepath = os.path.join(config.EXPORTS_DIR, f'{name}.xlsx')
    wb.save(filepath)

    return send_file(filepath, as_attachment=True,
                     download_name=f'{name}.xlsx',
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')


@export_bp.route('/export/pdf/single/<int:employee_id>')
def export_single_pdf(employee_id):
    emp = db.get_employee(employee_id)
    if not emp:
        return 'Not found', 404
    card_config = db.get_card_config(emp['session_id'])
    filepath = generate_single_pdf(emp, card_config)
    name = emp['field_data'].get('Name', emp['field_data'].get('name', 'card'))
    return send_file(filepath, as_attachment=True, download_name=f'{name}_namecard.pdf')


@export_bp.route('/export/info')
def export_info():
    return jsonify(exports_dir=os.path.abspath(config.EXPORTS_DIR))


@export_bp.route('/export/file/<filename>')
def serve_export_file(filename):
    filepath = os.path.join(config.EXPORTS_DIR, filename)
    if not os.path.isfile(filepath):
        return 'Not found', 404
    return send_file(filepath)


@export_bp.route('/export/open-folder', methods=['POST'])
def open_export_folder():
    exports_dir = os.path.abspath(config.EXPORTS_DIR)
    os.makedirs(exports_dir, exist_ok=True)
    system = platform.system()
    try:
        if system == 'Darwin':
            subprocess.Popen(['open', exports_dir])
        elif system == 'Windows':
            subprocess.Popen(['explorer', exports_dir])
        else:
            subprocess.Popen(['xdg-open', exports_dir])
        return jsonify(ok=True, exports_dir=exports_dir)
    except Exception as e:
        return jsonify(ok=False, error=str(e), exports_dir=exports_dir)
