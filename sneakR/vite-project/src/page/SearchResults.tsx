import { useLocation } from 'react-router-dom';

function SneakersResults() {
  // Récupérer les données des résultats de la recherche via useLocation
  const location = useLocation();
  const sneakers = location.state?.sneakers || []; // S'il n'y a pas de state, une liste vide

  return (
    <div>
      <h1>Résultats de la recherche</h1>
      {sneakers.length > 0 ? (
        <ul>
          {sneakers.map((sneaker: any) => (
            <li key={sneaker.id}>
              <h3>{sneaker.brand} - {sneaker.model}</h3>
              <p>Couleur : {sneaker.color}</p>
              <p>Prix : {sneaker.price} €</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun résultat trouvé.</p>
      )}
    </div>
  );
}

export default SneakersResults;