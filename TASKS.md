# TASKS.md — CuisineSync

Source de vérité pour le suivi opérationnel. Mis à jour à chaque session.

---

## Prochain milestone — M1 Authentification

- [ ] Modèle `User` custom (extend AbstractUser)
- [ ] Endpoints : inscription, connexion, déconnexion, profil
- [ ] Authentification par sessions Django (cookie + CSRF)
- [ ] Tests Django/DRF pour chaque endpoint

---

## Fait (milestones terminés)

### M0 — Squelette ✅

- [x] #3 — Initialiser la structure du projet (dossiers, .gitignore, README)
- [x] #4 — Squelette Django back-end (projet vide, apps, settings splittés, Dockerfile)
- [x] #5 — Squelette React/Vite front-end (projet vide, structure src/, Dockerfile)
- [x] #6 — Docker Compose (services db, back, front)
- [x] #7 — Nginx sur VPS configuré avec snippet `/CuisineSync/` (port 80 → containers)
- [x] #8 — CI/CD GitHub Actions fonctionnel (push main → deploy SSH → docker compose up)
- [x] #14 — Health check `GET /api/v1/health/` → `{"status": "ok"}`
- [x] #15 — Vite base path `/CuisineSync/` pour assets corrects sous Nginx

**Validé en production :**
- `http://212.227.88.212/CuisineSync/` → page React ✓
- `http://212.227.88.212/CuisineSync/api/v1/health/` → `{"status": "ok"}` ✓
