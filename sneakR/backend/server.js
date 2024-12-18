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
  password: process.env.DB_PASSWORD || "rootpassword",
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
  if (!authHeader) return res.status(401).json({ message: "Accès non autorisé." });

  const token = authHeader.split(" ")[1]; // Récupérer le token après "Bearer "

  if (!token) return res.status(401).json({ message: "Token manquant." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide." });
    req.user = user; // Ajoute les informations de l'utilisateur à la requête
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
    return res.status(400).json({ message: "userId et sneakerId sont requis." });
  }

  // Vérifier si le sneaker est déjà dans la wishlist
  const checkQuery = "SELECT * FROM wishlist WHERE user_id = ? AND sneaker_id = ?";
  db.query(checkQuery, [userId, sneakerId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la vérification de la wishlist :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Ce sneaker est déjà dans votre wishlist." });
    }

    // Ajouter le sneaker à la wishlist
    const insertQuery = "INSERT INTO wishlist (user_id, sneaker_id) VALUES (?, ?)";
    db.query(insertQuery, [userId, sneakerId], (err) => {
      if (err) {
        console.error("Erreur lors de l'ajout à la wishlist :", err);
        return res.status(500).json({ message: "Erreur serveur." });
      }

      res.status(201).json({ message: "Sneaker ajouté à la wishlist avec succès." });
    });
  });
});

// Route pour supprimer un sneaker de la wishlist
app.delete("/api/wishlist", authenticateToken, (req, res) => {
  const { userId, sneakerId } = req.body;

  if (!userId || !sneakerId) {
    return res.status(400).json({ message: "userId et sneakerId sont requis." });
  }

  // Supprimer le sneaker de la wishlist
  const deleteQuery = "DELETE FROM wishlist WHERE user_id = ? AND sneaker_id = ?";
  db.query(deleteQuery, [userId, sneakerId], (err) => {
    if (err) {
      console.error("Erreur lors de la suppression de la wishlist :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.status(200).json({ message: "Sneaker supprimé de la wishlist avec succès." });
  });
});

// --- ROUTE PROFIL UTILISATEUR ---

// Route pour récupérer les informations d'un utilisateur
app.get("/api/user/:id", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "ID utilisateur invalide." });
  }

  const query = "SELECT id, username, email FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des informations utilisateur :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(results[0]);
  });
});

// Route pour modifier les informations d'un utilisateur
app.put("/api/user/:id", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { username, email, password } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ message: "ID utilisateur invalide." });
  }

  if (!username && !email && !password) {
    return res.status(400).json({ message: "Aucune donnée à modifier." });
  }

  // Construire la requête SQL pour la mise à jour
  let updateQuery = "UPDATE users SET ";
  const params = [];
  if (username) {
    updateQuery += "username = ?, ";
    params.push(username);
  }
  if (email) {
    updateQuery += "email = ?, ";
    params.push(email);
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateQuery += "password = ?, ";
    params.push(hashedPassword);
  }

  // Enlever la virgule supplémentaire à la fin de la requête
  updateQuery = updateQuery.slice(0, -2);
  updateQuery += " WHERE id = ?";

  params.push(userId);

  db.query(updateQuery, params, (err, results) => {
    if (err) {
      console.error("Erreur lors de la mise à jour des informations utilisateur :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.status(200).json({ message: "Informations utilisateur mises à jour avec succès." });
  });
});


// Route pour récupérer les informations de l'utilisateur
app.get("/api/profile/:userId", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "ID utilisateur invalide." });
  }

  // Vérifier que l'ID utilisateur dans le token correspond à celui dans l'URL
  if (req.user.userId !== userId) {
    return res.status(403).json({ message: "Accès non autorisé." });
  }

  const query = "SELECT id, username, email, address FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des informations utilisateur :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Retourner les informations utilisateur
    res.status(200).json(results[0]);
  });
});


// DELETE /api/collection/:shoeId
app.delete('/api/collection/:shoeId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { shoeId } = req.params;

  try {
    // Supprimer la chaussure de la collection
    const result = await db.execute('DELETE FROM collection WHERE id = ? AND user_id = ?', [shoeId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Chaussure non trouvée dans votre collection.' });
    }

    res.status(200).json({ message: 'Chaussure supprimée de la collection.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la chaussure.' });
  }
});

// POST /api/collection
app.post('/api/collection', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { name, brand, imageUrl, price } = req.body.shoe;

  if (!name || !brand || !imageUrl || !price) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  try {
    // Ajouter une chaussure à la collection de l'utilisateur
    const result = await db.execute(
      'INSERT INTO collection (user_id, name, brand, image_url, price) VALUES (?, ?, ?, ?, ?)',
      [userId, name, brand, imageUrl, price]
    );

    // Récupérer la chaussure ajoutée
    const newShoe = { id: result.insertId, name, brand, imageUrl, price };
    res.status(201).json({ shoe: newShoe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la chaussure.' });
  }
});

// GET /api/collection
app.get('/api/collection', authenticateToken, async (req, res) => {
  const userId = req.user.id; // Assurez-vous que le token JWT contient l'ID utilisateur
  try {
    // Récupérer les chaussures dans la collection et la wishlist
    const [collection] = await db.execute('SELECT * FROM collection WHERE user_id = ?', [userId]);
    const [wishlist] = await db.execute('SELECT * FROM wishlist WHERE user_id = ?', [userId]);

    res.json({ collection, wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des données.' });
  }
});

// Ajouter une sneaker à la collection
app.post('/api/collection', authenticateToken, async (req, res) => {
  const userId = req.user.id; // ID de l'utilisateur extrait du token JWT
  const sneaker = req.body; // Données envoyées dans le corps de la requête

  // Vérification des données
  if (!sneaker || !sneaker.id || !sneaker.brand || !sneaker.colorway) {
    return res.status(400).json({ error: 'Données invalides : ID, marque et colorway requis.' });
  }

  try {
    // Ajouter la sneaker à la collection
    await db.execute(
      'INSERT INTO collection (user_id, sneaker_id, brand, colorway, estimated_market_value, gender, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        sneaker.id,
        sneaker.brand,
        sneaker.colorway,
        sneaker.estimated_market_value,
        sneaker.gender,
        sneaker.image_url,
      ]
    );

    res.status(201).json({ message: 'Sneaker ajoutée à la collection.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la sneaker à la collection.' });
  }
});


// --- Démarrage du serveur ---
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});