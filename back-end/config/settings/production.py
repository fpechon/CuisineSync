from decouple import config

from .base import *  # noqa: F401, F403

DEBUG = False

ALLOWED_HOSTS = config("ALLOWED_HOSTS", cast=lambda v: [h.strip() for h in v.split(",")])

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("POSTGRES_DB", default="cuisinesync"),
        "USER": config("POSTGRES_USER", default="cuisinesync"),
        "PASSWORD": config("POSTGRES_PASSWORD"),
        "HOST": config("POSTGRES_HOST", default="db"),
        "PORT": config("POSTGRES_PORT", default="5432"),
    }
}

CSRF_TRUSTED_ORIGINS = config(
    "CSRF_TRUSTED_ORIGINS", cast=lambda v: [h.strip() for h in v.split(",")]
)
CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS", cast=lambda v: [h.strip() for h in v.split(",")]
)

SESSION_COOKIE_SECURE = config("SESSION_COOKIE_SECURE", default=True, cast=bool)
