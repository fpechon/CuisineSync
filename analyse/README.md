# CuisineSync

## Description du Projet

CuisineSync est une application web conçue pour faciliter la gestion et l'organisation des recettes de cuisine. Elle permet aux utilisateurs de stocker leurs recettes personnelles, de rechercher des plats selon divers critères, de planifier des repas et de générer des listes de courses intelligentes. L'application intègre également un système d'inventaire pour optimiser l'utilisation des ingrédients disponibles à la maison.

Ce projet est structuré en trois parties principales :
- L'analyse du projet (dossier `analyse/`)
- Le back-end (dossier `back-end/`)
- Le front-end (dossier `front-end/`)

## Fonctionnalités Principales

### Gestion des Recettes
- **Ajout de recettes** : Permettre à l'utilisateur d'ajouter de nouvelles recettes avec les informations suivantes :
  - Titre de la recette
  - Description courte du plat
  - Liste des ingrédients avec quantités (ex. : 200g de farine, 3 œufs)
  - Étapes de préparation détaillées
  - Temps de préparation et de cuisson
  - Nombre de portions
  - Photos du plat fini et optionnellement de chaque étape
- **Modification et suppression** : Éditer ou supprimer des recettes existantes.
- **Visualisation** : Afficher les recettes de manière claire, avec images et étapes numérotées.

### Recherche de Recettes
- **Critères de recherche** : Rechercher des recettes par :
  - Type de recette (ex. : entrée, plat principal, dessert, végétarien, vegan, etc.)
  - Temps total de préparation (ex. : rapide < 30 min, moyen 30-60 min, long > 60 min)
  - Ingrédients présents ou absents
  - Mots-clés dans le titre ou la description
- **Résultats filtrés** : Afficher les résultats triés par pertinence ou autres critères.

### Panier de Recettes et Liste de Courses
- **Panier** : Ajouter des recettes sélectionnées à un panier virtuel pour planifier des repas.
- **Génération de liste de courses** : "Sommer" automatiquement les ingrédients de toutes les recettes dans le panier, en tenant compte des quantités et des unités, pour produire une liste consolidée d'achats nécessaires.

### Inventaire et Suggestions de Recettes
- **Gestion de l'inventaire** : Permettre à l'utilisateur de lister les ingrédients disponibles dans le frigo, le garde-manger, etc., avec quantités.
- **Suggestions intelligentes** :
  - Recettes réalisables sans achat supplémentaire (tous ingrédients disponibles).
  - Si aucune recette complète, afficher des recettes où il manque quelques ingrédients, triées par nombre d'ingrédients manquants (priorité aux recettes nécessitant le moins d'achats).
- **Mise à jour de l'inventaire** : Après réalisation d'une recette, déduire les ingrédients utilisés.

### Fonctionnalités Additionnelles (Suggestions)
- **Catégorisation** : Organiser les recettes par catégories personnalisables (ex. : cuisine française, asiatique, etc.).
- **Partage** : Option pour partager des recettes avec d'autres utilisateurs ou exporter en format PDF.
- **Notes personnelles** : Ajouter des commentaires ou modifications personnelles à une recette.
- **Calendrier de repas** : Planifier des repas sur une semaine ou un mois, intégrant le panier et l'inventaire.
- **Notifications** : Rappels pour les ingrédients périssables ou les repas planifiés.

## Technologies et Architecture
- **Back-end** : API RESTful pour gérer les données (recettes, inventaire, utilisateurs).
- **Front-end** : Interface utilisateur web responsive pour une expérience fluide.
- **Base de données** : Stockage des recettes, ingrédients, et données utilisateur.
- **Authentification** : Système de comptes utilisateurs pour données personnelles.

Ce README servira de spécification pour l'implémentation future par un agent IA. Assurez-vous que toutes les fonctionnalités sont clairement définies pour une implémentation complète et cohérente.
