import axios from "axios"

const api = axios.create({
  baseURL: 'https://54.37.12.181:1337/api',
});

export const fetchSneakers = async () => {
  const reponse = await api.get('/sneakers?pagination%5BwithCount%5D=true');
  return reponse.data;
  };

  export default api ;
