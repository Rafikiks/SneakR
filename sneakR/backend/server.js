const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

// Créer une instance de l'application Express
const app = express();

// Permettre l'accès depuis React (localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173', // Remplacez par l'URL de votre frontend si nécessaire
}));

// Middleware pour parser les données JSO
app.use(express.json());

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'sneakers_db',
});

// Tester la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connexion réussie à la base de données MySQL');
});

// Routes pour les utilisateurs

// Récupérer tous les utilisateurs
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      return res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
    }
    res.json(results); // Retourner tous les utilisateurs sous forme de JSON
  });
});

// Récupérer un utilisateur par son ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  if (!Number(userId)) {
    return res.status(400).json({ message: 'L\'ID de l\'utilisateur est invalide.' });
  }

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, err);
      return res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'utilisateur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(results[0]); // Retourner l'utilisateur sous forme de JSON
  });
});

// Ajouter un nouvel utilisateur
app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Les données de l\'utilisateur sont incomplètes.' });
  }

  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);
      return res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de l\'utilisateur.' });
    }
    res.status(201).json({ message: 'Utilisateur ajouté avec succès', id: results.insertId });
  });
});

// Mettre à jour un utilisateur
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  if (!Number(userId)) {
    return res.status(400).json({ message: 'L\'ID de l\'utilisateur est invalide.' });
  }

  db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, userId], (err, results) => {
    if (err) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${userId}:`, err);
      return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'utilisateur' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur mis à jour avec succès' });
  });
});

// Supprimer un utilisateur
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  if (!Number(userId)) {
    return res.status(400).json({ message: 'L\'ID de l\'utilisateur est invalide.' });
  }

  db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${userId}:`, err);
      return res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'utilisateur' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  });
});

// Routes pour le panier

// Récupérer les articles du panier d'un utilisateur
app.get('/api/cart/:user_id', (req, res) => {
  const userId = req.params.user_id;

  if (!Number(userId)) {
    return res.status(400).json({ message: 'L\'ID de l\'utilisateur est invalide.' });
  }

  db.query(
    `SELECT cart.id, cart.product_id, cart.quantity, sneakers.name, sneakers.price 
     FROM cart 
     JOIN sneakers ON cart.product_id = sneakers.id 
     WHERE cart.user_id = ?`,
    [userId],
    (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération du panier:', err);
        return res.status(500).json({ message: 'Erreur serveur lors de la récupération du panier.' });
      }
      res.json(results);
    }
  );
});

// Ajouter un article au panier
app.post('/api/cart', (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Les données du panier sont incomplètes ou invalides.' });
  }

  // Vérification de l'existence du produit
  db.query('SELECT * FROM sneakers WHERE id = ?', [product_id], (err, productResults) => {
    if (err) {
      console.error('Erreur lors de la vérification du produit:', err);
      return res.status(500).json({ message: 'Erreur serveur lors de la vérification du produit.' });
    }

    if (productResults.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier si l'utilisateur existe
    db.query('SELECT * FROM users WHERE id = ?', [user_id], (err, userResults) => {
      if (err) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', err);
        return res.status(500).json({ message: 'Erreur serveur lors de la vérification de l\'utilisateur.' });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Ajouter l'article au panier
      db.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [user_id, product_id, quantity],
        (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'ajout au panier:', err);
            return res.status(500).json({ message: 'Erreur serveur lors de l\'ajout au panier.' });
          }
          res.status(201).json({ message: 'Article ajouté au panier avec succès', id: results.insertId });
        }
      );
    });
  });
});

// Supprimer un article du panier
app.delete('/api/cart/:id', (req, res) => {
  const cartItemId = req.params.id;

  if (!Number(cartItemId)) {
    return res.status(400).json({ message: 'L\'ID de l\'article est invalide.' });
  }

  db.query('DELETE FROM cart WHERE id = ?', [cartItemId], (err, results) => {
    if (err) {
      console.error(`Erreur lors de la suppression de l'article ${cartItemId}:`, err);
      return res.status(500).json({ message: 'Erreur serveur lors de la suppression de l\'article du panier' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Article non trouvé dans le panier' });
    }

    res.json({ message: 'Article supprimé du panier avec succès' });
  });
});

// Mettre à jour un article dans le panier (modifier la quantité)
app.put('/api/cart/:id', (req, res) => {
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  if (!Number(cartItemId)) {
    return res.status(400).json({ message: 'L\'ID de l\'article est invalide.' });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'La quantité doit être supérieure à zéro.' });
  }

  db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, cartItemId], (err, results) => {
    if (err) {
      console.error(`Erreur lors de la mise à jour de l'article ${cartItemId}:`, err);
      return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'article du panier' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Article non trouvé dans le panier' });
    }

    res.json({ message: 'Article mis à jour dans le panier avec succès' });
  });
});

// Démarrer le serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
}); 