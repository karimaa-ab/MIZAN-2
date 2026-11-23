# Mizan – Partie 2

## 1. Présentation du projet

**Mizan** est une application web de gestion de produits et de réservations.

Cette deuxième partie du projet consiste à connecter l'interface utilisateur à une API REST afin de gérer les produits à travers des requêtes HTTP asynchrones avec l'API Fetch.

Les données sont stockées dans un fichier `db.json` à l'aide de JSON Server.

## 2. Technologies utilisées

- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- JavaScript Modules (ES Modules)
- Fetch API
- JSON Server
- Git et GitHub
- Visual Studio Code

## 3. Fonctionnalités

### Gestion des produits

- Afficher la liste des produits depuis l'API.
- Consulter les détails d'un produit.
- Ajouter un nouveau produit.
- Modifier complètement un produit.
- Modifier partiellement un produit.
- Changer le statut d'un produit entre « Disponible » et « Réservé ».

### Recherche et organisation

- Rechercher un produit par son nom.
- Filtrer les produits selon leur statut.
- Trier les produits par nom, prix et date.

### Validation et gestion des erreurs

- Vérifier le titre, la description et le prix avant l'envoi.
- Afficher les messages de succès et d'erreur.
- Afficher un indicateur de chargement pendant les requêtes.
- Gérer les erreurs réseau, HTTP et les délais d'attente.

## 4. Structure du projet

Les fichiers JavaScript de la Partie 2 sont organisés en modules :

```text
srcPartie2/
│
├── api2.js
├── main2.js
├── products.js
├── state.js
├── storage2.js
├── ui2.js
└── validation2.js
```

### Rôle des fichiers

| Fichier | Responsabilité |
|---|---|
| `api2.js` | Centraliser les requêtes HTTP et gérer les erreurs. |
| `main2.js` | Gérer les événements et coordonner les fonctionnalités. |
| `products.js` | Gérer les opérations sur les produits et les traitements des données. |
| `state.js` | Gérer l'état de l'application. |
| `storage2.js` | Gérer le stockage local des données. |
| `ui2.js` | Créer et afficher les éléments de l'interface. |
| `validation2.js` | Vérifier les données saisies par l'utilisateur. |

## 5. Configuration et lancement

### Prérequis

- Visual Studio Code
- Node.js
- JSON Server

### Étape 1 : Lancer JSON Server

Dans le terminal, exécuter :

```bash
npx json-server db.json
```

L'API sera accessible à l'adresse :

```text
http://localhost:3000/products
```

### Étape 2 : Lancer l'application

Ouvrir `indexPart2.html` avec Live Server.

L'application sera accessible, par exemple, à l'adresse :

```text
http://127.0.0.1:5500/indexPart2.html
```

## 6. Communication avec l'API REST

Les requêtes HTTP sont centralisées dans `api2.js` à travers une fonction `request()`.

Cette fonction utilise Fetch API pour communiquer avec le serveur et traiter les réponses et les erreurs.

### Les méthodes HTTP utilisées

| Méthode | Opération | Description |
|---|---|---|
| GET | Lecture | Récupérer la liste ou les détails d'un produit. |
| POST | Création | Ajouter un nouveau produit. |
| PUT | Modification complète | Remplacer les données d'un produit. |
| PATCH | Modification partielle | Modifier uniquement certaines propriétés d'un produit. |

## 7. Différence entre PUT et PATCH

### PUT – Remplacement complet

La méthode PUT permet de remplacer complètement une ressource existante.

Dans Mizan, le formulaire de modification est pré-rempli avec les informations du produit sélectionné.

L'utilisateur peut modifier ses informations, puis les données sont validées avant leur envoi au serveur.

Exemple :

```javascript
await modifierProduit(id, {
    title: "Nouvelle bague",
    description: "Description du produit",
    price: 250,
    image: "",
    status: "Disponible",
    date: "2026-11-23"
});
```

### PATCH – Modification partielle

La méthode PATCH permet de modifier uniquement certaines propriétés d'une ressource, sans remplacer toutes ses données.

Dans Mizan, elle est utilisée pour changer le statut d'un produit directement depuis la liste.

Exemple :

```javascript
await modifierPartiellementProduit(id, {
    status: "Réservé"
});
```

Dans cet exemple, seul le statut est modifié. Les autres informations du produit restent inchangées.

### Tableau comparatif

| PUT | PATCH |
|---|---|
| Remplacement complet | Modification partielle |
| Envoie l'ensemble des données | Envoie uniquement les propriétés à modifier |
| Utilisé avec le formulaire de modification | Utilisé notamment pour changer le statut depuis la liste |

## 8. Notion d'idempotence

L'idempotence signifie qu'une opération peut être exécutée plusieurs fois avec les mêmes données sans modifier le résultat final après la première exécution.

### PUT et idempotence

PUT est une méthode idempotente.

Exemple : envoyer plusieurs fois les mêmes informations d'un produit avec PUT donne le même résultat final.

### PATCH et idempotence

PATCH n'est pas nécessairement idempotente. Cela dépend de l'opération effectuée.

Dans notre application, envoyer plusieurs fois :

```javascript
{
    status: "Réservé"
}
```

donne le même résultat final : le produit reste « Réservé ».

Cette opération PATCH est donc idempotente dans ce cas précis.

## 9. Gestion des erreurs

L'application prévoit plusieurs catégories d'erreurs :

- **Timeout** : lorsque la requête dépasse le délai autorisé.
- **Network** : lorsqu'une erreur de connexion survient.
- **Offline** : lorsque l'utilisateur n'a pas de connexion Internet.
- **HTTP** : lorsqu'une réponse HTTP indique une erreur.
- **Parse** : lorsque les données reçues ne peuvent pas être interprétées correctement.

Des messages sont affichés à l'utilisateur afin de faciliter la compréhension des problèmes rencontrés.

## 10. Objectif pédagogique

Cette partie du projet permet de pratiquer :

- La communication avec une API REST.
- L'utilisation de Fetch API et des fonctions `async/await`.
- Les méthodes HTTP GET, POST, PUT et PATCH.
- La manipulation des données JSON.
- La séparation du code en modules JavaScript.
- La validation des données.
- La gestion des erreurs asynchrones.
- La mise à jour dynamique de l'interface utilisateur.

---

**Projet : Mizan – Partie 2**