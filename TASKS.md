# TASKS.md — CuisineSync

Source de vérité pour le suivi opérationnel. Mis à jour à chaque session.

---

## En cours — M1 Interface recettes (front mockée)

- [ ] #20 — Structure pages React : RecipeList, RecipeDetail, MealPlan, ShoppingList
- [ ] #21 — Données mockées (JSON) : 3 recettes exemple avec ingrédients
- [ ] #22 — Page liste de recettes (cards cliquables)
- [ ] #23 — Page détail d'une recette (ingrédients + étapes)
- [ ] #24 — Sélection de recettes pour la semaine (panier localStorage)
- [ ] #25 — Page liste de courses (agrégation des ingrédients par unité)

---

## Milestones à venir

### M2 — Auth basique
- Inscription / connexion / déconnexion via sessions Django
- Un seul compte utilisateur (createsuperuser)
- Front adapte l'UI selon l'état de session

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
