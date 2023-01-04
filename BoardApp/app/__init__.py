from flask_sqlalchemy import SQLAlchemy
from faker import Faker
from werkzeug.security import generate_password_hash
from sqlalchemy.event import listen


db = SQLAlchemy()
Faker.seed(40)
fake = Faker()
