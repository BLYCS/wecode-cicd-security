const express = require('express');
const cors = require('cors');
const produitsRouter = require('./routes/produits');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Sert la page frontend (public/index.html) et ses assets ---
app.use(express.static('public'));

// --- Route de santé (utile pour vérifier que l'app tourne, et pour le CI/CD plus tard) ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'wecode-cicd-security', timestamp: new Date().toISOString() });
});

// --- Route d'info API (JSON, utile pour Postman/curl) ---
app.get('/api', (req, res) => {
  res.json({
    message: 'API de gestion de stock - Wecode CI/CD Security',
    endpoints: {
      'GET /health': 'Vérifier que l\'API fonctionne',
      'GET /api/produits': 'Liste tous les produits',
      'GET /api/produits/alertes': 'Produits sous le seuil d\'alerte',
      'GET /api/produits/:id': 'Détail d\'un produit',
      'POST /api/produits': 'Créer un produit',
      'PUT /api/produits/:id': 'Modifier un produit',
      'DELETE /api/produits/:id': 'Supprimer un produit'
    }
  });
});

// --- Routes produits ---
app.use('/api/produits', produitsRouter);

// --- Gestion des routes inconnues ---
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
