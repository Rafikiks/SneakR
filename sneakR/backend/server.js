const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
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

// Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({ message: 'La ressource demandée est introuvable.' });
});

// Démarrer le serveur
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});