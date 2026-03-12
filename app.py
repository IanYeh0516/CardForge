import os
import subprocess
import platform

from flask import Flask
from dotenv import load_dotenv

import db
from routes.session_bp import session_bp
from routes.employee_bp import employee_bp
from routes.template_bp import template_bp
from routes.export_bp import export_bp
from routes.config_bp import config_bp

load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB upload limit


@app.before_request
def ensure_db():
    db.init_db()


# Register blueprints
app.register_blueprint(session_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(template_bp)
app.register_blueprint(export_bp)
app.register_blueprint(config_bp)


def _kill_port(port):
    """Silently kill any process occupying the given port."""
    system = platform.system()
    try:
        if system == 'Windows':
            result = subprocess.run(['netstat', '-ano'], capture_output=True, text=True)
            for line in result.stdout.splitlines():
                if f':{port} ' in line and 'LISTENING' in line:
                    pid = line.strip().split()[-1]
                    subprocess.run(['taskkill', '/PID', pid, '/F'], capture_output=True)
        else:
            result = subprocess.run(['lsof', '-ti', f':{port}'], capture_output=True, text=True)
            for pid in result.stdout.strip().split('\n'):
                if pid:
                    subprocess.run(['kill', '-9', pid])
    except Exception:
        pass


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    _kill_port(port)
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() in ('true', '1', 'yes')
    print(f"CardForge started: http://localhost:{port}")
    app.run(debug=debug, port=port)
