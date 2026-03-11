import os
import uuid
from io import BytesIO

from flask import Blueprint, request, jsonify, send_file

import config
import db

template_bp = Blueprint('template', __name__)


@template_bp.route('/template/raw/<int:session_id>/<side>')
def template_raw(session_id, side):
    card_config = db.get_card_config(session_id)
    if not card_config:
        return 'Not found', 404
    key = 'front_template' if side == 'front' else 'back_template'
    filename = card_config.get(key, '')
    if not filename:
        from PIL import Image
        img = Image.new('RGB', (1063, 638), '#FFFFFF')
        buf = BytesIO()
        img.save(buf, 'PNG')
        buf.seek(0)
        return send_file(buf, mimetype='image/png')
    filepath = os.path.join(config.TEMPLATES_DIR, filename)
    if not os.path.isfile(filepath):
        return 'Not found', 404
    return send_file(filepath)


@template_bp.route('/template/upload', methods=['POST'])
def upload_template():
    session_id = request.form.get('session_id', type=int)
    side = request.form.get('side', 'front')
    file = request.files.get('file')

    if not file or not session_id:
        return jsonify(error='Missing file or session_id'), 400

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ('.jpg', '.jpeg', '.png'):
        return jsonify(error='Please upload a JPG or PNG image'), 400

    filename = f"{side}_{session_id}_{uuid.uuid4().hex[:6]}{ext}"
    filepath = os.path.join(config.TEMPLATES_DIR, filename)
    file.save(filepath)

    if side == 'front':
        db.save_card_config(session_id, front_template=filename)
    else:
        db.save_card_config(session_id, back_template=filename)

    return jsonify(ok=True, filename=filename)


@template_bp.route('/template/default/<int:session_id>/<side>', methods=['POST'])
def set_default_template(session_id, side):
    data = request.get_json() or {}
    filename = data.get('filename', '').strip()
    if not filename:
        filename = config.DEFAULT_FRONT_TEMPLATE if side == 'front' else config.DEFAULT_BACK_TEMPLATE
    filepath = os.path.join(config.TEMPLATES_DIR, filename)
    if not os.path.isfile(filepath):
        return jsonify(error=f'File not found: {filename}'), 404
    if side == 'front':
        db.save_card_config(session_id, front_template=filename)
    else:
        db.save_card_config(session_id, back_template=filename)
    return jsonify(ok=True)
