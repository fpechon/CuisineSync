# CuisineSync

Application web de gestion de recettes, inventaire et liste de courses.

## Stack technique

| Couche | Technologie |
|---|---|
| Back-end | Python 3.11 + Django 4.2 + Django REST Framework |
| Front-end | React 18 + Vite |
| Base de données | PostgreSQL 15 |
| Déploiement | Docker Compose + Nginx |
| CI/CD | GitHub Actions |

## Lancer en local

```bash
# Démarrer tous les services
docker-compose up -d

# Back-end seul (sans Docker)
cd back-end
cp .env.example .env
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Front-end seul (sans Docker)
cd front-end
cp .env.example .env
npm install
npm run dev
```

## Architecture de déploiement

```
Internet → Nginx (VPS :80/:443)
              ├── /api/v1/ → Gunicorn (back-end :8000)
              └── /        → React build (fichiers statiques)
```

Déploiement automatique via GitHub Actions sur push vers `main`.
