from decouple import config


class Config:
    SECRET_key = config('SECRET_KEY')


class Development(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = config("URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

config = {
    "development": Development,
}
