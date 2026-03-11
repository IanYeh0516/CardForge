import json
import os

from flask import Blueprint, request, jsonify

import config
import db

config_bp = Blueprint('config', __name__)


PRESET_PATH = os.path.join(config.DATA_DIR, 'layout_preset.json')


@config_bp.route('/config/<int:session_id>', methods=['GET'])
def get_config(session_id):
    cfg = db.get_card_config(session_id)
    if not cfg:
        return jsonify(error='Not found'), 404
    return jsonify(cfg)


@config_bp.route('/config/<int:session_id>', methods=['POST'])
def update_config(session_id):
    data = request.get_json() or {}
    allowed = ['card_width', 'card_height', 'dpi', 'field_layout', 'bg_color']
    updates = {k: v for k, v in data.items() if k in allowed}
    if updates:
        db.save_card_config(session_id, **updates)
    return jsonify(ok=True)


@config_bp.route('/preset/save/<int:session_id>', methods=['POST'])
def save_preset(session_id):
    cfg = db.get_card_config(session_id)
    if not cfg:
        return jsonify(error='Not found'), 404
    with open(PRESET_PATH, 'w', encoding='utf-8') as f:
        json.dump({'field_layout': cfg['field_layout']}, f, ensure_ascii=False, indent=2)
    return jsonify(ok=True)


@config_bp.route('/preset/load/<int:session_id>', methods=['POST'])
def load_preset(session_id):
    if not os.path.isfile(PRESET_PATH):
        return jsonify(error='Preset file not found'), 404
    with open(PRESET_PATH, 'r', encoding='utf-8') as f:
        preset = json.load(f)
    field_layout = preset.get('field_layout', [])
    db.save_card_config(session_id, field_layout=field_layout)
    return jsonify(ok=True, field_layout=field_layout)


@config_bp.route('/preset/exists')
def preset_exists():
    return jsonify(exists=os.path.isfile(PRESET_PATH))
