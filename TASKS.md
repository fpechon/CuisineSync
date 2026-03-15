# TASKS.md — CuisineSync

Source de vérité pour le suivi opérationnel. Mis à jour à chaque session.

---

## Notes techniques à ne pas oublier

- **SESSION_COOKIE_SECURE** : quand un domaine + HTTPS sera configuré sur le VPS, retirer `SESSION_COOKIE_SECURE=False` du `.env` du VPS pour revenir à `True` (défaut).

---

## Milestones à venir

### M4 — Panier + liste de courses persistée
- `MealPlan` en base, lié à l'utilisateur Django
- Agrégation des ingrédients côté serveur (même unité d'abord)
- Persistance multi-appareils

### M5 — Inventaire
- Ingrédients déjà à la maison
- Soustraits automatiquement de la liste de courses

---

## Fait (milestones terminés)

### M3 — Back recettes + branchement API ✅

- [x] #34 — App Django `recipes` + modèles `Recipe`, `Ingredient`, `RecipeIngredient`
- [x] #35 — Serializers DRF + endpoints lecture (`GET /api/v1/recipes/`, `GET /api/v1/recipes/{id}/`)
- [x] #36 — Tests DRF pour les endpoints recettes
- [x] #37 — Fixtures : 3 recettes exemples en base
- [x] #38 — Front : service `recipes.js` + remplacement des mocks JSON par la vraie API

**Note future :** Ajouter la saisie de recettes dans l'app React (formulaire création/édition), pour ne pas dépendre de l'admin Django.

### M2 — Auth basique ✅

- [x] #27 — App Django `users` + endpoints `login` / `logout` / `me`
- [x] #28 — Tests Django pour les endpoints auth (7/7 verts)
- [x] #29 — Front : page de connexion
- [x] #30 — Front : service auth + état de session (Zustand)
- [x] #31 — Front : routes protégées + adapter la navbar

**Validé en production :**
- `http://212.227.88.212/CuisineSync/` → redirigé vers `/login` ✓
- Connexion / déconnexion fonctionnelles ✓
- Admin Django accessible via tunnel SSH ✓

### M1 — Interface recettes (front mockée) ✅

- [x] #20 — Structure pages React : RecipeList, RecipeDetail, MealPlan, ShoppingList
- [x] #21 — Données mockées (JSON) : 3 recettes exemple avec ingrédients
- [x] #22 — Page liste de recettes (cards cliquables)
- [x] #23 — Page détail d'une recette (ingrédients + étapes)
- [x] #24 — Sélection de recettes pour la semaine (panier localStorage)
- [x] #25 — Page liste de courses (agrégation des ingrédients par unité)

### M0 — Squelette ✅

- [x] #3 — Initialiser la structure du projet (dossiers, .gitignore, README)
- [x] #4 — Squelette Django back-end (projet vide, apps, settings splittés, Dockerfile)
- [x] #5 — Squelette React/Vite front-end (projet vide, structure src/, Dockerfile)
- [x] #6 — Docker Compose (services db, back, front)
- [x] #7 — Nginx sur VPS configuré avec snippet `/CuisineSync/` (port 80 → containers)
- [x] #8 — CI/CD GitHub Actions fonctionnel (push main → deploy SSH → docker compose up)
- [x] #14 — Health check `GET /api/v1/health/` → `{"status": "ok"}`
- [x] #15 — Vite base path `/CuisineSync/` pour assets corrects sous Nginx
