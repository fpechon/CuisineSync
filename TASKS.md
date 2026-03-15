# TASKS.md — CuisineSync

Source de vérité pour le suivi opérationnel. Mis à jour à chaque session.

---

## En cours — M2 Auth basique

- [ ] #27 — App Django `users` + endpoints `login` / `logout` / `me`
- [ ] #28 — Tests Django pour les endpoints auth
- [ ] #29 — Front : page de connexion
- [ ] #30 — Front : service auth + état de session (Zustand)
- [ ] #31 — Front : routes protégées + adapter la navbar

---

## Milestones à venir

### M3 — Back recettes + branchement API
- Modèles `Recipe` + `Ingredient` en base PostgreSQL
- CRUD recettes via DRF
- Front remplace les mocks JSON par la vraie API

### M4 — Panier + liste de courses persistée
- `MealPlan` en base, lié à l'utilisateur Django
- Agrégation des ingrédients côté serveur (même unité d'abord)
- Persistance multi-appareils

### M5 — Inventaire
- Ingrédients déjà à la maison
- Soustraits automatiquement de la liste de courses

---

## Fait (milestones terminés)

### M1 — Interface recettes (front mockée) ✅

- [x] #20 — Structure pages React : RecipeList, RecipeDetail, MealPlan, ShoppingList
- [x] #21 — Données mockées (JSON) : 3 recettes exemple avec ingrédients
- [x] #22 — Page liste de recettes (cards cliquables)
- [x] #23 — Page détail d'une recette (ingrédients + étapes)
- [x] #24 — Sélection de recettes pour la semaine (panier localStorage)
- [x] #25 — Page liste de courses (agrégation des ingrédients par unité)

**Validé localement :**
- `http://localhost:5173/CuisineSync/` → liste de recettes ✓
- Panier persisté en localStorage ✓
- Agrégation Carbonara + Minestrone → 600g spaghetti ✓

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
