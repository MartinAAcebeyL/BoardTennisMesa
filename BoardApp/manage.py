# boardPingPong
import mimetypes
from flask_socketio import SocketIO, emit
from config import config
from app import create_app

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

config = config['development']

app = create_app(config)
socket = SocketIO(app=app)




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
