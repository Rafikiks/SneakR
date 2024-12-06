import axios from "axios";

const api = axios.create({
  baseURL: 'http://54.37.12.181:1337/api', // Utilisation de l'URL correcte
});

export const fetchSneakers = async (page: number, pageSize: number) => {
  try {
    const response = await api.get('/sneakers', {
      params: {
        'pagination[withCount]': false, // Ne pas inclure le count dans la réponse
        'pagination[page]': page, // Page à afficher
        'pagination[pageSize]': pageSize, // Nombre d'éléments par page
        'pagination[start]': (page - 1) * pageSize, // Calcul du début de la page
        'pagination[limit]': 25, // Limite totale des éléments à charger (si nécessaire)
        'fields': 'Title', // Champs à inclure dans la réponse
      },
    });
    return response.data; // Retourne les données récupérées
  } catch (error) {
    console.error("Erreur lors de la récupération des sneakers:", error);
    throw error; // Lancer l'erreur pour pouvoir la capturer dans le composant
  }
};

export default api;