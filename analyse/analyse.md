# Projet: CuisineSync

## Contexte

### 1. Introduction

L'objectif est de développer une application mobile. CuisineSync qui est un assistant culinaire intelligent. Il a été crée pour rendre notre vie en cuisine plus pratique et agréable en offrant un ensemble de fonctionnalités intuitives. CuisineSync simplifie la planification des repas, l'organisation des listes d'achats, et assure une gestion optimale de votre réfrigérateur. Plongeons dans les caractéristiques clés de cette application innovante.

### 2. Définition du sujet

Le projet vise à développer une application mobile nommée "CuisineSync" conçue comme un assistant culinaire intelligent. L'objectif principal de cette application est de simplifier et d'améliorer l'expérience des utilisateurs en cuisine. Elle offre un ensemble de fonctionnalités intuitives qui incluent l'exploration de recettes variées, l'organisation des listes d'achats, et la gestion optimale du contenu du réfrigérateur.

### 3. Description du sujet

CuisineSync permet aux utilisateurs d'explorer un catalogue diversifié de recettes, d'ajouter leurs plats préférés à une liste dédiée, et de contribuer en intégrant leurs propres recettes au catalogue partagé. La fonction de création de panier facilite les courses en générant une liste d'ingrédients intelligente basée sur les recettes sélectionnées et le contenu du frigo.

La gestion du frigo en temps réel simplifie la tenue d'un inventaire, déduisant automatiquement les ingrédients utilisés lors de la cuisson et ajoutant ceux achetés via la liste des courses. La possibilité d'ajouter des notes spécifiques sur les ingrédients, telles que la marque préférée ou la quantité désirée, offre une personnalisation supplémentaire.

La connexion à Open Food Fact fournit des informations détaillées sur les ingrédients, renforçant ainsi la transparence et la qualité des choix alimentaires. La liste d'achats, présentée de manière claire et pratique, simplifie le processus d'achat, et sa fonction connectée pour le ménage évite les achats en doublon en temps réel.

En d'autre mot, CuisineSync vise à révolutionner la manière dont les utilisateurs planifient, cuisinent et organisent leurs repas au quotidien, en mettant l'accent sur la convivialité, la personnalisation et l'efficacité.

### 4. Contraintes

* **Plateformes Mobiles :** Nous envisageons une application pour plusieurs plateformes (iOS, Android), nous devons nous assurer que le développement, le test et la maintenance sont compatibles avec ces environnements différents.

* **Ressources Techniques :** La création d'une application demande des compétences techniques particulières, et étant une équipe de deux personnes, nous devrons composer avec nos ressources limitées en termes de capacités techniques.

* **Intégration avec Open Food Fact :** La connexion à une base de données externe comme Open Food Fact peut être soumise à des restrictions d'accès, de délais ou de limitations d'utilisation. Nous devons nous assurer de respecter leurs conditions d'utilisation.

* **Coût de Développement :** Le budget alloué au développement de l'application peut être une contrainte. Il faut prendre en compte les coûts liés à la conception, au développement, aux tests, à la maintenance, ainsi qu'éventuellement aux licences et à l'hébergement.

* **Sécurité des Données :** L'application gérera des données sensibles, telles que les recettes, les préférences alimentaires, etc. Nous devons mettre en place des mesures de sécurité robustes pour protéger ces informations.

* **Expérience Utilisateur :** Les attentes des utilisateurs en termes d'ergonomie et de convivialité sont élevées. La conception de l'interface utilisateur doit être soigneusement étudiée pour assurer une expérience utilisateur positive.

* **Conformité Réglementaire :** Si l'application manipule des informations personnelles ou des données alimentaires, elle pourrait être soumise à des réglementations telles que RGPD ou d'autres normes sectorielles. (a se renseigner)

* **Tests et Débogage :** Les tests sont essentiels pour assurer la qualité de l'application. Cela peut être une contrainte en termes de temps et de ressources, mais négliger cette étape peut entraîner des problèmes graves après le lancement.

* **Évolutivité :** L'application doit être conçue de manière à pouvoir évoluer avec le temps pour s'adapter aux nouvelles fonctionnalités, aux changements de plateforme et aux besoins des utilisateurs.

### 5. Méthodes et outils

# Concept 

## 1. Définition des objectifs

Les objectifs de notre application "CuisineSync" sont les suivants :

* **Simplifier l'Expérience Culinaire :** Fournir aux utilisateurs une application conviviale et intuitive pour rendre la planification des repas, la gestion des ingrédients, et la cuisson des recettes aussi simples et agréables que possible.
* **Explorer et Diversifier les Recettes :** Offrir une vaste collection de recettes variées dans un catalogue, permettant aux utilisateurs d'explorer de nouvelles idées culinaires et de diversifier leurs choix de repas.
* **Faciliter l'Organisation des Listes d'Achats :** Simplifier le processus d'achat en générant des listes d'achats intelligentes basées sur les recettes sélectionnées et l'inventaire du frigo, contribuant ainsi à une planification efficace des courses.
* **Optimiser la Gestion du Frigo :** Permettre aux utilisateurs de maintenir un inventaire frigo en temps réel, avec des déductions automatiques des ingrédients utilisés lors de la cuisson et des ajouts provenant de la liste des courses.
* **Encourager la Contribution Utilisateur :** Permettre aux utilisateurs d'enrichir le catalogue en ajoutant leurs propres recettes, favorisant ainsi un partage collaboratif au sein de la communauté.
* **Intégration Transparente avec Open Food Fact :** Fournir des informations détaillées sur les ingrédients grâce à une intégration fluide avec la base de données d'Open Food Fact, renforçant la transparence et la qualité des choix alimentaires.
* **Promouvoir une Liste d'Achats Connectée :** Faciliter le ménage en partageant et mettant à jour en temps réel la liste des achats entre tous les membres d'un foyer, évitant ainsi les achats en doublon.
* **Garantir la Sécurité des Données :** Mettre en place des mesures de sécurité robustes pour protéger les informations sensibles des utilisateurs, telles que les recettes personnelles et les préférences alimentaires.
* **Offrir une Expérience Utilisateur Exceptionnelle :** Concevoir une interface utilisateur attrayante et conviviale pour garantir une expérience utilisateur positive, encourageant une utilisation régulière et agréable de l'application.
* **Évolutivité et Améliorations Continues :** Concevoir l'application de manière à pouvoir évoluer avec le temps, en intégrant de nouvelles fonctionnalités et en répondant aux retours des utilisateurs pour continuellement améliorer l'expérience globale.

## 2. Champ couvert

La portée de "CuisineSync" sera limitée à la Belgique, ce qui signifie que l'application sera spécifiquement conçue pour répondre aux besoins et aux particularités culinaires des utilisateur dans ce pays. Cela pourrait inclure des fonctionnalités spécifiques liées à la disponibilité des produits, aux préférences alimentaires locales, aux marques populaires en Belgique, et à d'autres aspects pertinents pour les utilisateurs belges. Cette limitation géographique permettra une approche plus ciblée et personnalisée pour mieux servir la communauté culinaire belge. (multilangue ? -> Français, Néerlandais, Anglais?)

## 3. Contexte

## 4. Acteurs concernés

## 5. Environnement d’exploitation

## 6. Considération des problèmes possibles

## 7. Critères et indicateurs de succès

# Analyse

## 1. Analyse de l’existant

## 2. Analyse des contraintes

## 3. Analyse des fonctionnalités

### a. Fonctionnalités principales

* **Catalogues de Recettes :** Explorer une variété infinie de recettes proposées dans notre catalogue diversifié.

* **Liste de Favoris :** Ajouter une recette préférées à notre liste de favoris pour un accès facile et rapide.

* **Ajouter une Recette au Catalogue :** Les utilisateurs peuvent contribuer en ajoutant leurs propres recettes au catalogue. Chaque nouvelle recette ajoutée sera automatiquement intégrée à la liste de recettes favorites de l'utilisateur créateur.

* **Créer un Panier pour la Liste des Achats :** En fonction des recettes sélectionnées et de notre inventaire frigo, l'application générera une liste d'ingrédients nécessaire grâce à des calculs intelligents.

* **Gestion du Frigo :** Maintenir un inventaire en temps réel de notre réfrigérateur. Chaque fois que nous cuisinons, les ingrédients sont déduits automatiquement. Les articles achetés via la liste des courses seront également ajoutés automatiquement au frigo.

* **Gestion des Ingrédients :** Chaque recette est accompagnée d'une liste détaillée d'ingrédients, avec la possibilité d'ajouter des notes spécifiques telles que la marque préférée ou le type de quantité.

* **Connexion à Open Food Fact :** Obtenir des informations détaillées sur nos ingrédients en les reliant directement à la base de données d'Open Food Fact.

* **Liste d'Achats Facile à Utiliser :** Visualisez votre liste d'achats de manière claire et pratique. Cochez les articles achetés d'un simple geste pour une expérience sans tracas.

* **Liste Connectée pour le Ménage :** La liste des achats est partagée et mise à jour en temps réel pour tous les utilisateurs du ménage. Ainsi, lorsque quelqu'un coche un élément de la liste, les autres utilisateurs le voient instantanément, évitant ainsi les achats en doublon.

### b. Fonctionnalités complémentaires

## 4. Organisation des interfaces

## 5. Les flux

### a. Diagramme des cas d’utilisations

### b.Diagramme d’activité
