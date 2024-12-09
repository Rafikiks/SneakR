import axios from "axios";

const api = axios.create({
  baseURL: 'http://54.37.12.181:1337/api/sneakers', // 
});

export const fetchSneakers = async (page: number, pageSize: number) => {
  try {
    const response = await api.get('/sneakers', {
      params: {
        'pagination[withCount]': false, 
        'pagination[page]': page, 
        'pagination[pageSize]': pageSize,
        'pagination[start]': (page - 1) * pageSize,
        'pagination[limit]': 25, 
        'fields': 'Title',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des sneakers:", error);
    throw error;
  }
};

export default api;