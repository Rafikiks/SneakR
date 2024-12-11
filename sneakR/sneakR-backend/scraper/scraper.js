const fetch = require("node-fetch");
const mysql = require("mysql2/promise");

// Configuration de la base de données
const dbConfig = {
  host: "localhost",
  user: "root", // Remplacez par votre utilisateur MySQL
  password: "", // Remplacez par votre mot de passe MySQL
  database: "sneakers_db", // Nom de la base de données
};

// Fonction pour scraper les données depuis l'API
const fetchSneakers = async (page) => {
  const url = `http://54.37.12.181:1337/api/sneakers?pagination[withCount]=true&pagination[page]=${page}&pagination[pageSize]=50`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Erreur API : ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.data; // Renvoyer uniquement les sneakers
  } catch (error) {
    console.error("Erreur lors du fetch :", error.message);
    return [];
  }
};

// Fonction pour insérer les sneakers dans la base de données
const insertSneakersIntoDB = async (sneakers) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const insertQuery = `
      INSERT INTO sneakers (brand, colorway, estimated_market_value, gender, image_url, links)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const sneaker of sneakers) {
      const { brand, colorway, estimatedMarketValue, gender, image, links } = sneaker.attributes;

      // Insertion des données dans la base
      await connection.execute(insertQuery, [
        brand,
        colorway,
        estimatedMarketValue || null,
        gender || "unisex",
        image ? image.original : null,
        JSON.stringify(links),
      ]);

      console.log(`Inséré : ${brand} - ${colorway}`);
    }

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de l'insertion dans MySQL :", error.message);
  }
};

// Fonction principale pour scraper et insérer dans MySQL
const scrapeAndInsert = async () => {
  const totalPages = 1969; // Nombre total de pages

  for (let page = 1; page <= totalPages; page++) {
    console.log(`Scraping page ${page}...`);
    const sneakers = await fetchSneakers(page);

    if (!sneakers.length) {
      console.log(`Aucune donnée trouvée pour la page ${page}.`);
      break;
    }

    console.log(`Insertion des sneakers de la page ${page} dans la base de données...`);
    await insertSneakersIntoDB(sneakers);
  }

  console.log("Scraping et insertion terminés !");
};

// Lancer le processus de scraping
scrapeAndInsert();