from flask import Blueprint, request, jsonify

import db

employee_bp = Blueprint('employee', __name__)


@employee_bp.route('/session/<int:session_id>/employees', methods=['POST'])
def add_employee(session_id):
    data = request.get_json() or {}
    field_data = data.get('field_data', {})
    eid = db.add_employee(session_id, field_data)
    return jsonify(id=eid)


@employee_bp.route('/employee/<int:employee_id>', methods=['GET'])
def get_employee_api(employee_id):
    emp = db.get_employee(employee_id)
    if not emp:
        return jsonify(error='Not found'), 404
    return jsonify(emp)


@employee_bp.route('/employee/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    data = request.get_json() or {}
    field_data = data.get('field_data', {})
    db.update_employee(employee_id, field_data)
    return jsonify(ok=True)


@employee_bp.route('/employee/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    db.delete_employee(employee_id)
    return jsonify(ok=True)
