from .base import *  # noqa: F401, F403
from decouple import config

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]

SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Override DB host for local development without Docker
DATABASES["default"]["HOST"] = config("POSTGRES_HOST", default="localhost")  # noqa: F405
