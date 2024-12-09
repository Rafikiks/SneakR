const fetch = require('node-fetch'); // Assurez-vous d'avoir installé node-fetch
const FormData = require('form-data'); // Pour envoyer des fichiers en POST

// Fonction pour récupérer les sneakers depuis l'API externe
const fetchSneakers = async (page) => {
  try {
    const url = `http://54.37.12.181:1337/api/sneakers?pagination%5BwithCount%5D=true&pagination%5Bpage%5D=${page}&pagination%5BpageSize%5D=25`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Erreur lors du fetch de la page ${page}: ${res.status}`);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erreur lors du fetch des sneakers:", error);
  }
};

// Fonction pour obtenir un token d'authentification (JWT)
const getToken = async () => {
  const url = 'http://localhost:1337/api/auth/local'; // URL pour obtenir le token
  const credentials = {
    identifier: 'kykiraza@gmail.com',  // Remplace par ton identifiant Strapi
    password: 'Raza30092007'          // Remplace par ton mot de passe Strapi
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    if (!res.ok) {
      throw new Error(`Erreur d'authentification: ${res.status}`);
    }

    const data = await res.json();
    return data.jwt; // Le token généré
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
  }
};

// Fonction pour télécharger une image depuis une URL
const uploadImage = async (imageUrl, token) => {
  try {
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      console.error('URL de l\'image non valide, elle doit être absolue');
      return null;
    }

    const uploadUrl = 'http://localhost:1337/api/upload';

    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('Erreur lors du téléchargement de l\'image:', response.statusText);
      return null;
    }

    const imageBuffer = await response.buffer();
    const formData = new FormData();
    formData.append('files', imageBuffer, 'image.jpg');

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (uploadResponse.ok) {
      return uploadData[0];
    } else {
      console.error('Erreur lors de l\'upload de l\'image:', uploadData);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    return null;
  }
};

// Fonction pour envoyer un sneaker à Strapi
const sendToStrapi = async (sneaker, token) => {
  try {
    const url = 'http://localhost:1337/api/sneak-rs';

    let gender = sneaker.gender;
    if (gender !== 'men' && gender !== 'women' && gender !== 'unisex') {
      console.warn(`Valeur non valide pour gender: ${gender}. Valeur par défaut 'unisex' utilisée.`);
      gender = 'unisex';
    }

    const imageData = sneaker.image ? await uploadImage(sneaker.image, token) : null;
    if (!imageData) {
      console.error('Impossible de télécharger l\'image');
      return;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          brand: sneaker.brand,
          colorway: sneaker.colorway,
          estimatedMarketValue: sneaker.estimatedMarketValue,
          gender: gender,
          image: imageData.id,
          links: sneaker.links,
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Erreur lors de l'ajout du sneaker: ${data.message || 'Erreur inconnue'}`);
      console.log("Réponse complète de Strapi:", data);
    } else {
      console.log(`Sneaker ajouté avec succès: ${sneaker.brand} - ${sneaker.colorway}`);
    }

  } catch (error) {
    console.error("Erreur d'envoi vers Strapi:", error);
  }
};

// Fonction principale pour récupérer les sneakers et les envoyer à Strapi
const scrapeAndSend = async () => {
  try {
    const totalPages = 1969;  // Nombre total de pages à récupérer

    // Obtenir le token d'authentification
    const token = await getToken();
    if (!token) {
      throw new Error('Impossible de récupérer le token d\'authentification');
    }

    // Itérer à travers toutes les pages
    for (let page = 1; page <= totalPages; page++) {
      console.log(`Récupération de la page ${page}/${totalPages}`);

      const sneakers = await fetchSneakers(page);
      if (!sneakers || sneakers.length === 0) {
        console.log(`Aucun sneaker trouvé pour la page ${page}`);
        continue;
      }

      console.log(`Données récupérées pour la page ${page}:`, sneakers);

      for (const sneaker of sneakers) {
        const sneakerData = {
          brand: sneaker.attributes.brand,
          colorway: sneaker.attributes.colorway,
          estimatedMarketValue: sneaker.attributes.estimatedMarketValue,
          gender: sneaker.attributes.gender,
          image: sneaker.attributes.image.original,
          links: sneaker.attributes.links,
        };

        console.log("Envoi de sneaker vers Strapi:", sneakerData);
        
        await sendToStrapi(sneakerData, token);
      }
    }

  } catch (error) {
    console.error("Erreur lors du scraping ou de l'envoi:", error);
  }
};

// Lancer le processus de scraping et envoi
scrapeAndSend();