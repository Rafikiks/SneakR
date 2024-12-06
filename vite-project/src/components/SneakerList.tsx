import { useState, useEffect } from 'react';
import { fetchSneakers } from '../services/api';


const SneakersList = () => {
  const [sneakers, setSneakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect (() => {
  fetchSneakers()
  .then((data) => {
    setSneakers(data.data);
    setLoading(false);
  })
.catch ((error) => {
  console.error('Erreur lors de la récupération des sneakers:', error);
  });
 }, []);
  if (loading) return <p> Chargement...</p>;

  return (
    <div>
      <h2>Liste des sneakers</h2>
      <ul>
        {sneakers.map((sneaker) => (
          <li key={sneaker.id}>
            {sneaker.attributes.name} - {sneaker.attributes.brand}
          </li>
          ))}
      </ul>
    </div>
    );
    };

    export default SneakersList;