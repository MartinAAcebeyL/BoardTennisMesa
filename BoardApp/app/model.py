from . import *

class Arbitro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=False, nullable=False)
    password = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

    @classmethod
    def create(cls, username, password, email):
        hashed_password = generate_password_hash(password=password, method='sha256')
        return Arbitro(username=username, password=hashed_password, email=email)

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            return False


def insertar_registros(*args, **kwargs):
    default_password = '123456789'
    for i in range(10):
        name = f"arbitro{i}"
        email = fake.email()
        password = default_password

        usuario = Arbitro.create(username=name, password=password, email=email)
        usuario.save()


listen(Arbitro.__table__, "after_create", insertar_registros)
