from decouple import config

from .base import *  # noqa: F401, F403

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("POSTGRES_DB", default="cuisinesync"),
        "USER": config("POSTGRES_USER", default="cuisinesync"),
        "PASSWORD": config("POSTGRES_PASSWORD"),
        "HOST": config("POSTGRES_HOST", default="localhost"),
        "PORT": config("POSTGRES_PORT", default="5432"),
    }
}

CSRF_TRUSTED_ORIGINS = ["http://localhost:5173"]
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
