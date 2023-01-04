import mimetypes
from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit
from werkzeug.security import check_password_hash
from config import config
from app import db
from app.model import Arbitro
config = config['development']

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

app = Flask(__name__)
app.config.from_object(config)
socket = SocketIO(app=app)

with app.app_context():
    db.init_app(app)
    db.create_all()


@app.route('/', methods=['GET', 'POST'])
def login():
    # recibir datos del formulario
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        # verificar si el usuario existe
        user = Arbitro.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            return redirect(url_for('board_ping_pong', data=user.id))
    return render_template('login.html')


@app.route('/board')
def board_ping_pong():
    endpoint = request.args.get('data')
    return render_template('board.html', endpoint=endpoint)


@app.route('/score')
def score():
    return render_template('score.html')

# sockets


@socket.on('inicio')
def inicio(json):
    emit('inicio', json, broadcast=True)


@socket.on('puntos')
def puntos(puntos):
    emit('puntos', puntos, broadcast=True)


@socket.on('set')
def puntos(puntos):
    emit('set', puntos, broadcast=True)


@socket.on('saque')
def cambio_saque(saca):
    equipo_saca = saca.split(':')[1]
    emit('saque', equipo_saca, broadcast=True)


if __name__ == '__main__':
    app.run(debug=True)
