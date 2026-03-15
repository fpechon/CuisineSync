FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings.production

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copier uv depuis l'image officielle
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Installer les dépendances depuis le lock file (reproductible)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-editable

# Mettre le venv créé par uv dans le PATH
ENV PATH="/app/.venv/bin:$PATH"

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
