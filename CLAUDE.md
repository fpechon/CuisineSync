# CLAUDE.md — CuisineSync

Fichier de référence permanent. À lire en début de chaque session, sans exception.
Mis à jour après chaque session significative.

---

## Projet

**CuisineSync** — Application web de gestion de recettes, inventaire et liste de courses.
Développeur solo. Développement en local via WSL2, déploiement sur VPS via SSH + GitHub Actions.

---

## Stack technique

> ⚠️ Ces choix sont fixés. Ne pas proposer d'alternatives sans raison explicite.

| Couche | Technologie |
|---|---|
| Back-end | Python 3.11 + Django 4.2 + Django REST Framework |
| Front-end | React 18 + Vite |
| Base de données | PostgreSQL 15 |
| ORM | Django ORM (intégré) |
| Authentification | Sessions Django (cookie de session + CSRF) |
| Validation API | Django REST Framework serializers |
| Déploiement | Docker Compose + Nginx séparé (reverse proxy) |
| Serveur WSGI | Gunicorn |
| CI/CD | GitHub Actions |
| Versioning | Git + GitHub |

---

## Structure du projet

```
cuisinesync/
├── CLAUDE.md                   # Ce fichier
├── TASKS.md                    # Suivi opérationnel des tâches
├── docker-compose.yml          # Orchestration locale et production
├── nginx/
│   └── nginx.conf              # Config reverse proxy
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD GitHub Actions
│
├── back-end/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── config/                 # Projet Django principal
│   │   ├── settings/
│   │   │   ├── base.py         # Settings communs
│   │   │   ├── local.py        # Settings développement
│   │   │   └── production.py   # Settings production
│   │   ├── urls.py             # Routes racine
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── users/              # App authentification
│   │   ├── recipes/            # App recettes
│   │   ├── inventory/          # App inventaire
│   │   └── shopping/           # App liste de courses
│   └── .env.example
│
└── front-end/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── components/         # Composants React réutilisables
    │   ├── pages/              # Pages principales
    │   ├── hooks/              # Custom hooks
    │   ├── services/           # Appels API (fetch)
    │   └── store/              # État global (Zustand)
    └── .env.example
```

---

## Conventions de code

### Général
- Langue du code : anglais (variables, fonctions, classes, commentaires)
- Langue des commits et PR : français
- Pas de `print()` en production — utiliser le logger Django configuré

### Back-end (Django)
- Une app Django par domaine métier : `users`, `recipes`, `inventory`, `shopping`
- Nommage des fichiers : `snake_case` (convention Python)
- Nommage des classes : `PascalCase`
- Nommage des fonctions et variables : `snake_case`
- Les modèles Django définissent la structure de la base — toujours créer une migration après modification
- Ne jamais modifier une migration existante — créer une nouvelle
- Les serializers DRF gèrent toute la validation des inputs API
- Les views ne contiennent pas de logique métier — elles délèguent à des services ou managers
- Toujours retourner des erreurs structurées : `{ "error": { "code": "...", "message": "..." } }`
- Préférer les `APIView` ou `ViewSet` DRF aux vues Django classiques
- Routes API : `/api/v1/[ressource]/` (avec slash final, convention Django)

### Front-end
- Nommage des composants : `PascalCase`
- Nommage des fichiers de composants : `PascalCase.jsx`
- Un composant = un fichier
- Les appels API passent tous par `src/services/` — jamais de `fetch` direct dans un composant
- Gestion d'état global : Zustand uniquement (pas de Context API pour l'état partagé)
- Nommage des hooks custom : `useNomDuHook`

### Base de données
- Nommage des modèles Django : `PascalCase` singulier (ex : `User`, `Recipe`)
- Django traduit automatiquement en `snake_case` pour les tables PostgreSQL
- Toujours définir `__str__` sur chaque modèle
- Toujours définir `class Meta` avec `ordering` par défaut

### Git
- Branches : `feature/nom-court`, `fix/nom-court`, `chore/nom-court`
- Ne jamais commiter directement sur `main`
- Format des commits : `type: description courte, closes #N`
  - Types : `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
  - Exemple : `feat: add JWT middleware, closes #8`
- Une PR par milestone ou par feature significative

---

## Environnement local

### Prérequis
- WSL2 + Ubuntu 22.04+
- Python 3.11 ou plus (3.12+ recommandé)
- Node.js 20 (via `nvm`)
- Docker Desktop avec intégration WSL2 activée
- Git configuré avec clé SSH vers GitHub
- `gh` CLI (GitHub CLI) — installé, authentifié via PAT fine-grained sur le repo `CuisineSync`

### Note : node/nvm en session non-interactive

`nvm` est chargé via `.bashrc`, mais le guard `case $- in ... *) return;;` bloque son exécution dans les shells non-interactifs (ex : sessions Claude Code). Le bloc suivant a été ajouté **avant** ce guard dans `~/.bashrc` pour rendre `node`/`npm` disponibles partout :

```bash
export NVM_DIR="$HOME/.nvm"
if [ -d "$NVM_DIR/versions/node" ]; then
    _nvm_node="$(ls -d "$NVM_DIR/versions/node/"v*/ 2>/dev/null | sort -V | tail -1)"
    [ -n "$_nvm_node" ] && export PATH="${_nvm_node}bin:$PATH"
    unset _nvm_node
fi
```

Ce bloc sélectionne la version node la plus récente installée via nvm et l'ajoute au PATH — sans hardcoder la version.

### Lancer le projet en local

```bash
# Démarrer PostgreSQL via Docker
docker-compose up -d db

# Back-end
cd back-end
cp .env.example .env          # remplir les variables la première fois
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver    # port 8000

# Front-end (dans un autre terminal)
cd front-end
cp .env.example .env
npm install
npm run dev                   # port 5173
```

### Gestion de l'environnement virtuel

**Important** : Toujours utiliser un venv pour isoler les dépendances du projet. Ne jamais installer directement dans le Python système.

```bash
# Créer le venv (une seule fois)
cd back-end
python3 -m venv venv

# Activer le venv (avant chaque session)
source venv/bin/activate

# Désactiver le venv (quand tu as fini)
deactivate
```

**Pourquoi ?** Si tu as plusieurs projets Python, sans venv, les dépendances peuvent entrer en conflit. Chaque projet a son propre venv = isolation garantie.

**À faire systématiquement :**
- Crée le venv une seule fois
- Mais **active** le venv avant **chaque** session de développement
- Toujours vérifie que le prompt montre `(venv)` avant d'installer des paquets

### Variables d'environnement back-end (.env)

```
DJANGO_SETTINGS_MODULE=config.settings.local
SECRET_KEY=<générer avec: python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())">
DEBUG=True
DATABASE_URL=postgresql://cuisinesync:password@localhost:5432/cuisinesync
ALLOWED_HOSTS=localhost,127.0.0.1
SESSION_COOKIE_SECURE=False
CSRF_TRUSTED_ORIGINS=http://localhost:5173
```

### Variables d'environnement front-end (.env)

```
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Déploiement sur le VPS

### Infrastructure VPS
- **Adresse IP** : `212.227.88.212`
- **OS** : Ubuntu 22.04
- **Accès** : SSH avec clé (jamais par mot de passe)
- **Utilisateur de déploiement** : `deploy` (pas root)
- Docker + Docker Compose installés
- Nginx installé directement sur le VPS (hors Docker) comme reverse proxy
- HTTPS via Certbot + Let's Encrypt

### Architecture de déploiement

```
Internet
    ↓
Nginx (VPS, port 80/443)
    ├── /api/v1/  → Gunicorn (container back-end, port 8000)
    └── /         → Fichiers statiques React (buildés, servis par Nginx)
```

### Flux de déploiement

```
git push origin main
        ↓
GitHub Actions (deploy.yml)
        ↓
SSH sur le VPS
        ↓
git pull + docker-compose up -d --build
        ↓
python manage.py migrate (automatique au démarrage du container)
        ↓
npm run build → copie vers dossier servi par Nginx
```

### Commande de déploiement manuel (si besoin)

```bash
ssh deploy@<IP_VPS>
cd /home/deploy/cuisinesync
git pull origin main
docker-compose up -d --build
```

### Variables d'environnement production
Stockées dans `/home/deploy/cuisinesync/.env` sur le VPS.
**Jamais dans le repo git.** Le `.env` est dans `.gitignore`.

---

## Gestion des tâches

### Fichier TASKS.md
`TASKS.md` est la source de vérité pour le suivi opérationnel. Il vit à la racine du repo.

**Règles impératives pour Claude Code :**

1. **Lire TASKS.md en début de chaque session** — identifier la prochaine tâche non faite
2. **Travailler une seule tâche à la fois** — ne pas démarrer la suivante sans signaler la complétion
3. **Implémenter des tests pour chaque fonctionnalité développée** — tests unitaires ou intégration selon le contexte (back-end : tests Django/DRF ; front-end : tests Jest/Vitest). Les tests sont la preuve que le code fonctionne
4. **Cocher `[x]` uniquement quand la tâche est implémentée, testée ET que les tests passent** — pas quand elle est "à moitié faite"
5. **En fin de session**, relire TASKS.md et vérifier que chaque `[x]` correspond à du code réellement présent, testé et fonctionnel — corriger le statut si ce n'est pas le cas
6. **Ne jamais supprimer une tâche** — si elle est abandonnée, la marquer `[~]` avec une note explicative
7. **En fin de session**, proposer une PR avec les issues GitHub correspondantes dans la description (`closes #N`)

### Utilisation des agents

Claude Code utilise deux agents pour les tâches complexes :

**`search_subagent` — Pour explorer et chercher :**
- Comprendre la structure existante avant de modifier
- Localiser des patterns ou fichiers
- Rassembler du contexte multi-fichiers (modèles, tests, utilisations)

**`runSubagent` — Pour des tâches autonomes complexes :**
- Refactoriser du code multi-fichiers
- Investiguer des problèmes de tests/compile
- Générer des features avec dépendances croisées

**Pas besoin d'agents spécialisés Django/React** — les conventions sont assez claires dans ce document. Revisiter si le projet explose en taille.

### Format TASKS.md

```markdown
## En cours — M1 Auth

- [x] Tâche terminée et vérifiée
- [ ] Tâche à faire
- [~] Tâche abandonnée — raison

## Bloqué / problèmes en cours

- Description du problème et contexte

## Fait (milestones terminés)

- M0 — Squelette, CI/CD, déploiement VPS
```

### Milestones GitHub
Chaque milestone M0→M6 correspond à un milestone GitHub avec des issues associées.
Les commits référencent les issues (`closes #N`) pour fermeture automatique à la merge.
Pas de GitHub Projects — TASKS.md remplace le suivi granulaire.

---

## Workflow et discipline

### Plan Mode — Avant toute tâche de 3+ étapes

1. **Pour chaque tâche non-triviale** (3+ étapes ou décisions architecturales) : écrire un plan détaillé
2. **Si quelque chose déraille** : STOP immédiatement et re-planifier — ne pas continuer à forcer
3. **Vérifier avant de clore** : pas seulement implémenter, mais valider que ça marche
4. **Écrire des specs upfront** pour réduire l'ambiguïté

### Verification — Avant de marquer une tâche complète

- **Ne jamais clore sans preuve** : tests passent, logs clean, comportement correct
- **Diff et comparaison** : vérifier les changements vs la baseline quand pertinent
- **Se poser la question** : "Un senior engineer approuverait-il ça ?"
- **Tout tester localement** avant de committer
- Pour back-end : `python3 manage.py test` doit passer
- Pour front-end : `npm run test` doit passer

### Demand Elegance — Challenger les solutions hacky

- Pour les changements non-triviaux : **pause** et demander "Y a-t-il une solution plus élégante ?"
- Si une correction semble hacky : "Connaissant tout ce que je sais maintenant, quelle est la solution élégante ?"
- **Ignorer pour les fixes simples et évidents** — pas d'over-engineering
- **Challenger son propre travail** avant de le présenter

### Autonomous Bug Fixing — Agir sans demander d'aide

- Quand un bug est reporté : le fixer directement sans demander comment
- **Pointer les logs/erreurs/tests qui échouent** — puis résoudre
- **Zéro context-switching** requis du développeur
- Les tests CI qui échouent ? Fixe-les sans qu'on te le demande

### Self-Improvement Loop — Capturer les leçons

- Après **chaque correction** du développeur : mettre à jour la section "Leçons apprises"
- **Écrire les règles** que tu dois suivre pour éviter la même erreur
- Itérer ruthlessly jusqu'à ce que le taux d'erreurs baisse
- Relire les leçons en début de session

### Core Principles

**Simplicity First**
- Chaque changement doit être aussi simple que possible
- Minimal code impact
- Pas d'abstraction inutile

**No Laziness**
- Trouver les root causes — jamais de quick-fixes temporaires
- Standards d'un senior developer
- Code review mental : "Est-ce que je défenderais ça ?"

---

## Décisions d'architecture

*Chaque décision note le contexte et la raison. Ne pas revenir dessus sans discussion explicite.*

| Décision | Raison |
|---|---|
| Django plutôt que FastAPI | ORM intégré, admin Django utile pour déboguer les données, écosystème mature |
| Django REST Framework | Standard de facto pour les APIs Django, serializers puissants pour la validation |
| Sessions Django | Front servi par Nginx sur le même domaine en production — sessions plus simples et robustes que JWT pour ce cas d'usage |
| PostgreSQL | Données relationnelles, requêtes complexes pour les suggestions de recettes |
| Nginx hors Docker | Plus simple à configurer pour HTTPS avec Certbot, gestion des fichiers statiques React |
| Gunicorn comme WSGI | Standard de production pour Django, compatible avec Docker |
| Zustand pour l'état front | Plus simple que Redux, suffisant pour ce périmètre |
| Pas de GitHub Projects | TASKS.md + milestones GitHub couvrent le besoin pour un projet solo |

---

## Leçons apprises

*Mise à jour quand quelque chose ne fonctionne pas comme prévu. Ne jamais supprimer une entrée.*

*(vide pour l'instant — projet non démarré)*

---

## État du projet

**Date de dernière mise à jour :** à remplir à chaque session

**Milestone en cours :** M0 — Squelette

**Prochaine action :** Initialiser la structure du repo, docker-compose de base, squelette Django + React

**Milestones :**
- [ ] M0 — Squelette (structure, Docker, CI/CD, déploiement vide sur VPS)
- [ ] M1 — Authentification (inscription, connexion, JWT)
- [ ] M2 — CRUD Recettes (sans photos)
- [ ] M3 — Inventaire + bibliothèque d'ingrédients normalisés
- [ ] M4 — Liste de courses + conversion d'unités
- [ ] M5 — Suggestions de recettes par inventaire
- [ ] M6 — Recherche et filtres avancés