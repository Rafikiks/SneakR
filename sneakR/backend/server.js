const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Vérification des variables d'environnement
if (!process.env.JWT_SECRET) {
  console.error("Erreur : JWT_SECRET n'est pas défini dans le fichier .env");
  process.exit(1);
}

// Créer une instance Express
const app = express();

// Configuration CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Remplace par l'URL de ton frontend si nécessaire
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middleware JSON
app.use(express.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "sneakers_db",
});

// Tester la connexion
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion MySQL:", err);
    process.exit(1);
  }
  console.log("Connexion réussie à la base de données MySQL");
});

// Middleware d'authentification JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Accès non autorisé." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide." });
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// Route pour récupérer des sneakers avec filtres (MySQL)
app.get('/api/sneakers', (req, res) => {
  const { query } = req.query;

  // Si la requête est vide, retourner une liste vide
  if (!query) {
    return res.json([]);
  }

  // Séparer la requête en plusieurs mots-clés
  const keywords = query.split(/\s+/).map((keyword) => `%${keyword}%`); // Séparer par espaces et préparer les mots-clés

  // Construire la requête SQL en utilisant les mots-clés pour rechercher dans plusieurs colonnes
  let searchQuery = 'SELECT * FROM sneakers WHERE 1=1';
  const params = [];

  // Ajout de la recherche dans les différentes colonnes : brand, model, colorway, gender
  keywords.forEach((keyword) => {
    searchQuery += ' AND (brand LIKE ? OR model LIKE ? OR colorway LIKE ? OR gender LIKE ?)';
    params.push(keyword, keyword, keyword, keyword); // Appliquer chaque mot-clé à chaque colonne
  });

  // Ajouter une limite pour éviter trop de résultats
  const maxResults = 25;
  searchQuery += ` LIMIT ${maxResults}`;

  // Exécuter la requête SQL
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

// Route pour récupérer toutes les sneakers avec pagination
app.get("/api/sneakers/all", (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page courante, défaut à 1
  const limit = 25; // Nombre d'éléments par page
  const offset = (page - 1) * limit; // Définir l'offset pour la pagination

  const query = "SELECT * FROM sneakers LIMIT ? OFFSET ?";

  // Exécuter la requête SQL pour récupérer toutes les sneakers avec pagination
  db.query(query, [limit, offset], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des sneakers:", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    // Compter le total des sneakers pour déterminer le nombre total de pages
    db.query("SELECT COUNT(*) AS total FROM sneakers", (err, countResults) => {
      if (err) {
        console.error("Erreur lors du comptage des sneakers:", err);
        return res.status(500).json({ message: "Erreur serveur." });
      }

      const totalSneakers = countResults[0].total;
      const totalPages = Math.ceil(totalSneakers / limit);

      res.status(200).json({
        sneakers: results,
        totalPages: totalPages,
        currentPage: page,
        totalSneakers: totalSneakers,
      });
    });
  });
});
// Route pour récupérer les détails d'un sneaker par ID
app.get("/api/sneakers/:id", (req, res) => {
  const sneakerId = parseInt(req.params.id, 10);

  if (isNaN(sneakerId)) {
    return res.status(400).json({ message: "ID du sneaker invalide." });
  }

  const query = "SELECT * FROM sneakers WHERE id = ?";
  db.query(query, [sneakerId], (err, results) => {
    if (err) {
      console.error("Erreur récupération sneaker :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Sneaker non trouvé." });
    }

    res.status(200).json(results[0]);
  });
});

// Route d'enregistrement d'un nouvel utilisateur
app.post("/api/register", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur." });

    if (results.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(insertUserQuery, [username, email, hashedPassword], (err) => {
      if (err) {
        return res.status(500).json({ message: "Erreur serveur." });
      }
      res.status(201).json({ message: "Utilisateur créé avec succès." });
    });
  });
});

// Route de connexion d'un utilisateur
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur serveur." });

    if (results.length === 0) {
      return res.status(400).json({ message: "Utilisateur non trouvé." });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Connexion réussie.", token });
  });
});

// --- ROUTES WISHLIST ---

// Route pour récupérer la wishlist d'un utilisateur
app.get("/api/wishlist/:id", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "ID utilisateur invalide." });
  }

  const query = `
    SELECT s.* 
    FROM wishlist w 
    JOIN sneakers s ON w.sneaker_id = s.id 
    WHERE w.user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de la wishlist :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.status(200).json({ wishlist: results });
  });
});

// Route pour ajouter un sneaker à la wishlist
app.post("/api/wishlist", authenticateToken, (req, res) => {
  const { userId, sneakerId } = req.body;

  if (!userId || !sneakerId) {
    return res.status(400).json({ message: "L'ID utilisateur et l'ID du sneaker sont requis." });
  }

  const query = "INSERT INTO wishlist (user_id, sneaker_id) VALUES (?, ?)";
  db.query(query, [userId, sneakerId], (err) => {
    if (err) {
      console.error("Erreur lors de l'ajout à la wishlist :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.status(201).json({ message: "Sneaker ajouté à la wishlist." });
  });
});

// Route pour supprimer un sneaker de la wishlist
app.delete("/api/wishlist", authenticateToken, (req, res) => {
  const { userId, sneakerId } = req.body;

  if (!userId || !sneakerId) {
    return res.status(400).json({ message: "L'ID utilisateur et l'ID du sneaker sont requis." });
  }

  const query = "DELETE FROM wishlist WHERE user_id = ? AND sneaker_id = ?";
  db.query(query, [userId, sneakerId], (err) => {
    if (err) {
      console.error("Erreur lors de la suppression de la wishlist :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.status(200).json({ message: "Sneaker supprimé de la wishlist." });
  });
});



app.get("/api/profile/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;  // Récupère l'ID de l'utilisateur dans l'URL
  const tokenUserId = req.user.id;  // Récupère l'ID utilisateur du token

  if (userId !== tokenUserId) {
    return res.status(403).json({ message: "Accès interdit. Vous ne pouvez pas accéder à ce profil." });
  }

  // Requête SQL pour récupérer les données utilisateur
  const query = "SELECT name, email, address FROM users WHERE id = ?";
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération du profil :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Renvoie les données utilisateur
    res.status(200).json(results[0]);
  });
});

// --- Démarrage du serveur ---
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
