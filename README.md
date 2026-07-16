# Wecode CI/CD Security — Gestion de Stock

![CI](https://github.com/BLYCS/wecode-cicd-security/actions/workflows/ci.yml/badge.svg)

## Objectif
Projet pédagogique dans le cadre de la formation **Wecode | EPITECH**.
L'application (une API de gestion de stock) sert de support pratique pour
mettre en place, dans les prochains jours, un pipeline CI/CD intégrant des
contrôles de sécurité (scans de dépendances, secrets, SAST, etc.).

## Stack utilisée
- **Backend** : Node.js / Express
- **Stockage** : fichier JSON local (simple, pour se concentrer sur le CI/CD)
- **CI/CD** : GitHub Actions *(à venir)*
- **Sécurité** : scans à intégrer dans les prochains jours (Dependabot, npm audit, secret scanning...)

## Fonctionnalités
Gestion basique d'un stock de produits :
- Lister tous les produits
- Voir le détail d'un produit
- Voir les produits en dessous du seuil d'alerte
- Ajouter, modifier, supprimer un produit

## Installation

```bash
git clone https://github.com/<ton-user>/wecode-cicd-security.git
cd wecode-cicd-security
npm install
```

## Lancer l'application

```bash
npm start
```

Ou en mode développement (rechargement automatique) :

```bash
npm run dev
```

L'API est accessible sur : `http://localhost:3000`

## Endpoints disponibles

| Méthode | Route                  | Description                          |
|---------|------------------------|---------------------------------------|
| GET     | `/health`              | Vérifie que l'API fonctionne          |
| GET     | `/api/produits`        | Liste tous les produits               |
| GET     | `/api/produits/alertes`| Produits sous le seuil d'alerte       |
| GET     | `/api/produits/:id`    | Détail d'un produit                   |
| POST    | `/api/produits`        | Créer un nouveau produit               |
| PUT     | `/api/produits/:id`    | Modifier un produit existant          |
| DELETE  | `/api/produits/:id`    | Supprimer un produit                  |

### Exemple de création d'un produit (POST)

```json
{
  "nom": "Écran 24 pouces",
  "quantite": 10,
  "prix": 95000,
  "seuilAlerte": 3,
  "categorie": "Informatique"
}
```

## Prochaines étapes (Jours suivants)
- Mise en place du pipeline GitHub Actions
- Intégration de scans de sécurité (dépendances, secrets, code)
