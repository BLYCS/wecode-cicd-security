const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_PATH = path.join(__dirname, '..', 'data', 'produits.json');

// --- Fonctions utilitaires pour lire/écrire le fichier JSON ---
function lireProduits() {
  const contenu = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(contenu);
}

function ecrireProduits(produits) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(produits, null, 2));
}

// --- GET /api/produits : liste tous les produits ---
router.get('/', (req, res) => {
  const produits = lireProduits();
  res.json(produits);
});

// --- GET /api/produits/alertes : produits sous le seuil d'alerte ---
router.get('/alertes', (req, res) => {
  const produits = lireProduits();
  const enAlerte = produits.filter(p => p.quantite <= p.seuilAlerte);
  res.json(enAlerte);
});

// --- GET /api/produits/:id : détail d'un produit ---
router.get('/:id', (req, res) => {
  const produits = lireProduits();
  const produit = produits.find(p => p.id === parseInt(req.params.id));
  if (!produit) {
    return res.status(404).json({ message: 'Produit non trouvé' });
  }
  res.json(produit);
});

// --- POST /api/produits : créer un nouveau produit ---
router.post('/', (req, res) => {
  const { nom, quantite, prix, seuilAlerte, categorie } = req.body;

  if (!nom || quantite === undefined || prix === undefined) {
    return res.status(400).json({ message: 'Champs requis manquants (nom, quantite, prix)' });
  }

  const produits = lireProduits();
  const nouvelId = produits.length > 0 ? Math.max(...produits.map(p => p.id)) + 1 : 1;

  const nouveauProduit = {
    id: nouvelId,
    nom,
    quantite,
    prix,
    seuilAlerte: seuilAlerte ?? 5,
    categorie: categorie || 'Non catégorisé'
  };

  produits.push(nouveauProduit);
  ecrireProduits(produits);

  res.status(201).json(nouveauProduit);
});

// --- PUT /api/produits/:id : mettre à jour un produit ---
router.put('/:id', (req, res) => {
  const produits = lireProduits();
  const index = produits.findIndex(p => p.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Produit non trouvé' });
  }

  produits[index] = { ...produits[index], ...req.body, id: produits[index].id };
  ecrireProduits(produits);

  res.json(produits[index]);
});

// --- DELETE /api/produits/:id : supprimer un produit ---
router.delete('/:id', (req, res) => {
  const produits = lireProduits();
  const index = produits.findIndex(p => p.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: 'Produit non trouvé' });
  }

  const supprime = produits.splice(index, 1);
  ecrireProduits(produits);

  res.json({ message: 'Produit supprimé', produit: supprime[0] });
});

module.exports = router;
