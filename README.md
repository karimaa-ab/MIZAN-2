# Mizan — Application de suivi des prix de l'or et de l'argent

## 1. Présentation du projet

**Mizan** est une application web développée pour la bijouterie **Al Andalous**, située à Nador.

Elle permet de consulter les prix de l'or et de l'argent, de suivre leur évolution historique et de calculer la valeur d'un métal selon son poids.

L'application utilise une API externe pour récupérer les prix et propose une interface simple et accessible.

## 2. Fonctionnalités

### US-01 — Consultation des prix

- Récupération des prix actuels de l'or et de l'argent depuis l'API XAUS.
- Affichage du prix par gramme.
- Affichage des variations de prix.
- Indication de la tendance à la hausse ou à la baisse.

### US-02 — Affichage des cartes de prix

- Présentation des prix de l'or et de l'argent dans des cartes.
- Affichage des variations en valeur et en pourcentage.
- Indication visuelle de l'évolution des prix.

### US-03 — Gestion de la devise

L'utilisateur peut choisir entre trois devises :

- MAD
- USD
- EUR

La devise sélectionnée est sauvegardée dans le navigateur avec `localStorage` et restaurée lors du prochain chargement.

### US-04 — Historique des prix

- Consultation de l'historique de l'or et de l'argent.
- Choix du métal à afficher.
- Sélection d'une période de 7 ou 30 jours.
- Affichage de l'évolution des prix sous forme de graphique.
- Conversion des prix selon la devise sélectionnée.

Le graphique est réalisé en JavaScript natif, sans bibliothèque externe.

### US-05 — Calculateur

L'utilisateur peut :

- Choisir le métal : or ou argent.
- Saisir un poids en grammes.
- Calculer la valeur correspondante selon le prix actuel.

Une validation empêche les valeurs vides, négatives ou non numériques.

### US-06 — Gestion des états et des erreurs

L'application gère plusieurs situations :

- Chargement des données.
- Confirmation du chargement réussi.
- Erreur de connexion.
- Absence de connexion Internet.
- Erreurs HTTP (4xx et 5xx).
- Dépassement du quota API.
- Réponse JSON invalide.

Des boutons de nouvelle tentative permettent de relancer les requêtes en cas d'échec.

## 3. Technologies utilisées

- **HTML5** : structure de l'application.
- **Tailwind CSS** : mise en forme de l'interface.
- **JavaScript ES6+** : logique et interactions.
- **JavaScript Modules** : organisation du code.
- **Fetch API** : communication avec l'API externe.
- **localStorage** : sauvegarde de la devise sélectionnée.
- **XAUS API** : récupération des prix et des historiques.

Aucun framework JavaScript ni bibliothèque de graphiques n'est utilisé.

## 4. Architecture du projet

```text
Mizan/
│
├── index.html
│
└── src/
    ├── api.js
    ├── calculator.js
    ├── history.js
    ├── main.js
    ├── state.js
    ├── storage.js
    ├── ui.js
    └── validation.js
```

### Responsabilité des modules

| Fichier | Responsabilité |
|---|---|
| `api.js` | Récupération des prix actuels et des historiques depuis l'API. |
| `calculator.js` | Calcul de la valeur d'un métal selon son poids. |
| `history.js` | Préparation et conversion des données historiques pour le graphique. |
| `main.js` | Coordination des fonctionnalités et gestion des événements. |
| `state.js` | Gestion de l'état de l'application. |
| `storage.js` | Sauvegarde et récupération de la devise avec localStorage. |
| `ui.js` | Affichage des prix, graphiques, messages et états de l'interface. |
| `validation.js` | Validation du poids saisi dans le calculateur. |

## 5. API utilisée

L'application utilise l'API XAUS.

**URL de base des prix actuels :**

```text
https://xaus.com/api/v1/spot
```

**Historique de l'or :**

```text
https://xaus.com/api/v1/history
```

**Historique de l'argent :**

```text
https://xaus.com/api/v1/chart?symbol=silver&range=1mo&interval=1d
```

Les requêtes sont effectuées avec la Fetch API et les données reçues sont traitées en JavaScript.

## 6. Gestion des erreurs

Les erreurs sont interceptées et traitées afin d'éviter que l'application reste bloquée en cas de problème.

| Type d'erreur | Message affiché |
|---|---|
| OFFLINE | Vous êtes hors ligne. Vérifiez votre connexion. |
| NETWORK | Erreur de connexion au serveur. |
| HTTP_CLIENT | Erreur dans la requête (HTTP 4xx). |
| HTTP_SERVER | Erreur du serveur (HTTP 5xx). |
| QUOTA | Quota API dépassé. Réessayez plus tard. |
| JSON_INVALID | La réponse du serveur est illisible. |

Des boutons « Réessayer » permettent à l'utilisateur de relancer le chargement des prix ou de l'historique.

## 7. Installation et lancement

1. Cloner le dépôt GitHub :

```bash
git clone https://github.com/karimaa-ab/Mizan.git
```

2. Ouvrir le dossier du projet dans Visual Studio Code.

3. Lancer `index.html` avec l'extension Live Server.

4. Vérifier que la connexion Internet est disponible pour récupérer les données depuis l'API.

## 8. Tests effectués

Les fonctionnalités ont été vérifiées à travers plusieurs scénarios :

- Chargement des prix de l'or et de l'argent.
- Changement de devise.
- Conservation de la devise après rechargement.
- Affichage de l'historique selon le métal et la période sélectionnés.
- Calcul de la valeur selon le poids saisi.
- Validation des valeurs incorrectes.
- Simulation d'une absence de connexion Internet.
- Utilisation des boutons « Réessayer » après le rétablissement de la connexion.
- Vérification des états de chargement, de succès et d'erreur.

## 9. Sécurité et bonnes pratiques

- Utilisation des modules JavaScript ES.
- Séparation des responsabilités entre les fichiers.
- Utilisation de `textContent` pour afficher les données.
- Gestion des erreurs avec `try...catch`.
- Validation des données saisies par l'utilisateur.
- Aucun framework JavaScript ni bibliothèque de graphiques externe.

## 10. Limites du projet

- L'application dépend de la disponibilité de l'API XAUS pour récupérer les données actualisées.
- Les données historiques dépendent des réponses fournies par l'API.
- Le fonctionnement hors ligne ne garantit pas la récupération de nouveaux prix.

## 11. Auteur

Projet réalisé dans le cadre de la formation **YouCode — Développement Web**.