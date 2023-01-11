from flask import render_template, request, redirect, url_for, Blueprint
from app.model import Arbitro
from werkzeug.security import check_password_hash

ping = Blueprint('ping', __name__)


@ping.route('/', methods=['GET', 'POST'])
def login():
    # recibir datos del formulario
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        # verificar si el usuario existe
        user = Arbitro.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            return redirect(url_for('ping.board_ping_pong', data=user.id))
    return render_template('login.html')


@ping.route('/board')
def board_ping_pong():
    endpoint = request.args.get('data')
    return render_template('board.html', endpoint=endpoint)


@ping.route('/score')
def score():
    return render_template('score.html')
