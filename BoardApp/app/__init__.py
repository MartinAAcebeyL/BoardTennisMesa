from flask import Flask
from .views import ping
from .model import db


def create_app(config):
    app = Flask(__name__,  template_folder='../templates', static_folder='../static')

    app.config.from_object(config)
    app.register_blueprint(ping, url_prefix='/')

    with app.app_context():
        db.init_app(app)
        db.create_all()
    return app
