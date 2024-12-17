const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Vérification des variables d'environnement obligatoires
if (!process.env.JWT_SECRET) {
  console.error("Erreur : JWT_SECRET n'est pas défini dans le fichier .env");
process.exit(1);
}

// Créer une instance de l'application Express
const app = express();

// Configuration de CORS pour permettre l'accès au backend depuis le frontend
app.use(
  cors({
    origin: 'http://localhost:5173', // Remplacez par l'URL de votre frontend si nécessaire
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  })
);

// Middleware pour parser les données JSON
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

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Récupération du token

  if (!token) return res.status(401).json({ message: 'Accès non autorisé.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide.' });
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// Route pour récupérer tous les sneakers avec filtres dynamiques
a// Backend : Recherche basée sur la requête utilisateur, avec une limite de 25 résultats
app.get('/api/sneakers', (req, res) => {
  const { query } = req.query;

  let searchQuery = 'SELECT * FROM sneakers WHERE 1=1';
  const params = [];

  if (query) {
    searchQuery += ' AND (brand LIKE ? OR model LIKE ? OR colorway LIKE ?)';
    params.push(`%${query}%`, `%${query}%`, `%${query}%`);
  }

  // Ajouter une limite aux résultats
  const maxResults = 25;
  searchQuery += ` LIMIT ${maxResults}`;

  db.query(searchQuery, params, (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche des sneakers:', err);
      return res.status(500).json({ message: 'Erreur serveur lors de la recherche.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucun résultat trouvé.' });
    }

    res.status(200).json(results);
  });
});

// Route pour récupérer les détails d'un sneaker par son ID
app.get('/api/sneakers/:id', (req, res) => {
  const sneakerId = parseInt(req.params.id, 10);

  if (isNaN(sneakerId)) {
    return res.status(400).json({ message: 'ID du sneaker invalide.' });
  }

  const query = 'SELECT * FROM sneakers WHERE id = ?';
  db.query(query, [sneakerId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des détails du sneaker:', err);
      return res.status(500).json({ message: 'Erreur serveur lors de la récupération du sneaker.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Sneaker non trouvé.' });
    }

    res.status(200).json(results[0]);
  });
});

// Route pour enregistrer un nouvel utilisateur
app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Erreur lors de la vérification de l'utilisateur:", err);
        return res.status(500).json({ message: 'Erreur serveur.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertUserQuery, [username, email, hashedPassword], (err) => {
        if (err) {
          console.error("Erreur lors de l'insertion de l'utilisateur:", err);
          return res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
        }

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
      });
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route pour la connexion des utilisateurs
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Erreur lors de la recherche de l'utilisateur:", err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Connexion réussie.', token });
  });
});

// Démarrer le serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});