const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

// Route pour récupérer tous les sneakers
app.get('/api/sneakers', (req, res) => {
  const query = 'SELECT * FROM sneakers'; // La requête SQL pour récupérer tous les sneakers

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des sneakers:', err);
      return res
        .status(500)
        .json({ message: 'Erreur serveur lors de la récupération des sneakers.' });
    }
    res.status(200).json(results); // Retourner les sneakers sous forme de JSON
  });
});

// Route pour enregistrer un nouvel utilisateur
app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body;

  // Vérification des données reçues
  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', err);
        return res.status(500).json({ message: 'Erreur serveur.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur dans la base de données
      const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertUserQuery, [username, email, hashedPassword], (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'insertion de l\'utilisateur:', err);
          return res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
        }

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
      });
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
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
      console.error('Erreur lors de la recherche de l\'utilisateur:', err);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    const user = results[0];

    // Vérifier si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Créer un token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Connexion réussie.', token });
  });
});

// Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({ message: 'La ressource demandée est introuvable.' });
});

// Démarrer le serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});