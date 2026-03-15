# TASKS.md — CuisineSync

Source de vérité pour le suivi opérationnel. Mis à jour à chaque session.

---

## Notes techniques à ne pas oublier

- **SESSION_COOKIE_SECURE** : quand un domaine + HTTPS sera configuré sur le VPS, retirer `SESSION_COOKIE_SECURE=False` du `.env` du VPS pour revenir à `True` (défaut).

---

## Identité visuelle choisie — Direction "Paprika" 🌶️

**Palette :**

| Rôle | Hex |
|---|---|
| Background | `#F5EFE6` (parchemin) |
| Surface (cards) | `#FFFFFF` |
| Primaire (navbar, boutons) | `#C4451A` (paprika / terre brûlée) |
| Primaire hover | `#A33815` |
| Accent (secondaire) | `#2D6A4F` (vert olive — ex-primaire) |
| Texte | `#1C1209` (brun très foncé chaud) |
| Texte muted | `#8B7355` (taupe) |
| Bordures | `#E8DDD0` (beige rosé) |
| Selected / surbrillance | `#FFF0E8` (tinte chaude) |
| Danger | `#C0392B` |

**Typographie :**
- Titres (h1, h2, h3) : **Cormorant Garamond** 600/700 (Google Fonts)
- Corps de texte : **Inter** 400/500 (Google Fonts)

---

## En cours — M-UX1 : Installation Tailwind + shadcn/ui + identité visuelle

Objectif : poser les fondations visuelles sans rien casser. À la fin de ce milestone, l'app est visuellement identique (ou très proche) mais Tailwind est opérationnel, shadcn/ui est configuré, la palette Paprika et les polices sont appliquées globalement. Les prochains milestones s'appuient dessus.

- [x] #55 — Installer Tailwind CSS v4 + `@tailwindcss/vite` (plugin natif Vite)
- [x] #56 — Installer et configurer shadcn/ui (`components.json`, `src/lib/utils.js`, deps)
- [x] #57 — Charger Google Fonts (Cormorant Garamond + Inter) dans `index.html`
- [x] #59 — Appliquer la palette Paprika dans `index.css` + thème Tailwind (`@theme`)
- [x] #58 — Supprimer `App.css` (fichier legacy inutilisé du template Vite)

---

## Milestones à venir

### M-UX2 — Shell de l'application (Navbar, Login, 404, Spinner)

Objectif : migrer l'enveloppe de l'app (ce qui est toujours visible ou visible en premier). Vérifiable indépendamment du contenu.

- [ ] #XX — Composant `<Spinner />` (shadcn/ui Skeleton ou CSS), utilisé dans ProtectedRoute (fin de l'écran blanc au chargement)
- [ ] #XX — Page 404 : route catch-all `*` → composant `NotFound` avec lien retour
- [ ] #XX — Navbar migrée : logo SVG/icône + Playfair Display, active link selon la route courante
- [ ] #XX — Page Login migrée : layout split ou card centrée stylée, typographie, bouton shadcn
- [ ] #XX — Mobile navbar : barre de navigation inférieure sur < 768px (icônes + labels)

### M-UX3 — Pages de contenu (RecipeList, RecipeCard, RecipeDetail)

Objectif : migrer le cœur de l'app — la navigation dans les recettes. Vérifiable en parcourant les recettes et en en ouvrant une.

- [ ] #XX — RecipeCard migrée : image placeholder colorée (hash du nom) + layout shadcn Card
- [ ] #XX — RecipeList migrée : grid Tailwind, header avec actions, empty state avec illustration et CTA
- [ ] #XX — Skeleton loading pour RecipeList (remplace le texte "Chargement…")
- [ ] #XX — RecipeDetail migrée : hero bandeau coloré, étapes visuelles avec numéros en cercles, ingrédients cochables (état local)
- [ ] #XX — RecipeDetail : gestion explicite du 404 (recette introuvable → message + lien retour)

### M-UX4 — Flux panier & liste de courses (MealPlan, ShoppingList, Toasts)

Objectif : migrer et corriger le flux principal de l'app. Vérifiable en ajoutant des recettes au panier et en générant la liste de courses.

- [ ] #XX — Installer Sonner (toast notifications)
- [ ] #XX — Toast de confirmation à l'ajout/retrait du panier (RecipeCard + RecipeDetail)
- [ ] #XX — MealPlan migré : résumé (nb recettes, temps total), CTA "Générer la liste" proéminent, confirmation avant "Vider le panier"
- [ ] #XX — ShoppingList migrée : checkboxes persistées en localStorage (reset si le panier change)
- [ ] #XX — ShoppingList : bouton "Copier la liste" (Clipboard API)

### M-UX5 — Formulaire de création + polissage final (RecipeForm, Combobox, mobile)

Objectif : migrer le formulaire de création et finaliser l'expérience mobile. Vérifiable en créant une recette sur mobile.

- [ ] #XX — RecipeForm migré : layout shadcn, sections visuellement délimitées
- [ ] #XX — Combobox ingrédients (Headless UI ou Radix) à la place du `<datalist>` natif
- [ ] #XX — Validation inline au blur sur RecipeForm (avant soumission)
- [ ] #XX — Blocage navigation si le formulaire RecipeForm contient des données (`useBlocker`)
- [ ] #XX — Messages d'erreur backend traduits en français lisible (plus de `non_field_errors` bruts)
- [ ] #XX — Audit responsive complet (test iPhone / Android simulator sur toutes les pages)

---

## Fait (milestones terminés)

### Formulaire de création de recettes ✅ (feat ajouté entre M3 et M4)

- [x] #48 — Back: `units.py` + endpoint `GET /api/v1/recipes/units/`
- [x] #49 — Back: endpoint `GET /api/v1/recipes/ingredients/` (noms existants pour autocomplete)
- [x] #50 — Back: `RecipeCreateSerializer` avec validation, `POST /api/v1/recipes/`
- [x] #51 — Back: lookup ingrédients insensible à la casse (`iexact`) — évite les doublons
- [x] #52 — Front: service `units.js` + service `createRecipe` dans `recipes.js`
- [x] #53 — Front: page `RecipeForm.jsx` (champs dynamiques, datalist, validation conditionnelle)
- [x] #54 — Front: route `/recettes/nouvelle` + bouton "+ Nouvelle recette" dans RecipeList

### M4 — Panier persisté en base ✅

- [x] #42 — Back: modèle `MealPlan` + migration (OneToOneField User, ManyToManyField Recipe)
- [x] #43 — Back: endpoints CRUD `/api/v1/meal-plan/` (GET, POST add, DELETE remove, DELETE clear)
- [x] #44 — Back: tests endpoints panier (8 tests)
- [x] #45 — Front: service `mealPlan.js` + `mealPlanStore` sans persist (optimistic update)
- [x] #46 — Front: init panier au login/chargement, reset mémoire au logout

### M3 — Back recettes + branchement API ✅

- [x] #34 — App Django `recipes` + modèles `Recipe`, `Ingredient`, `RecipeIngredient`
- [x] #35 — Serializers DRF + endpoints lecture (`GET /api/v1/recipes/`, `GET /api/v1/recipes/{id}/`)
- [x] #36 — Tests DRF pour les endpoints recettes
- [x] #37 — Fixtures : 3 recettes exemples en base
- [x] #38 — Front : service `recipes.js` + remplacement des mocks JSON par la vraie API

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

---

## Archives (milestones déprioritisés)

### [~] M5 — Inventaire + bibliothèque d'ingrédients normalisés

Déprioritisé au profit du refactor UI/UX (M-UX1→M-UX5). À réévaluer après.

- Ingrédients déjà à la maison
- Soustraits automatiquement de la liste de courses

### [~] M6 — Liste de courses + conversion d'unités
### [~] M7 — Suggestions de recettes par inventaire
### [~] M8 — Recherche et filtres avancés
