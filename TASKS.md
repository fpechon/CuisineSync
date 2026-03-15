# TASKS.md — CuisineSync

Source de vérité pour le suivi opérationnel. Mis à jour à chaque session.

---

## En cours — M0 Squelette

- [x] #3 — Initialiser la structure du projet (dossiers, .gitignore, README)
- [x] #4 — Squelette Django back-end (projet vide, apps, settings splittés, Dockerfile) — `manage.py check` passe
- [x] #5 — Squelette React/Vite front-end (projet vide, structure src/, Dockerfile) — `npm run build` passe
- [x] #6 — Docker Compose (services db, back, front)
- [x] #7 — Configuration Nginx (reverse proxy, nginx.conf)
- [x] #8 — CI/CD GitHub Actions (deploy.yml, SSH sur VPS, docker-compose up)

**Note :** Le déploiement effectif sur le VPS nécessite de configurer les secrets GitHub (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`) et le fichier `.env` sur le serveur.

## Bloqué / problèmes en cours

*(aucun)*

## Fait (milestones terminés)

*(aucun — M0 en attente de validation déploiement VPS)*
