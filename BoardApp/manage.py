from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socket = SocketIO(app=app)


@app.route('/')
def login():
    return 'Hello World!'


@app.route('/board')
def board_ping_pong():
    return render_template('board.html')


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


if __name__ == '__main__':
    app.run(debug=True)
