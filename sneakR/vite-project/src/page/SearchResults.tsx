import { useLocation } from 'react-router-dom';

function SneakersResults() {
  // Récupérer les données des résultats de la recherche via useLocation
  const location = useLocation();
  const sneakers = location.state?.sneakers || []; // Les sneakers envoyées par la SearchBar
  const searchParams = location.state?.searchParams || {}; // Les paramètres de recherche (marque, couleur, etc.)

  // Extraire les paramètres de recherche pour les afficher
  const { brand, color, model } = searchParams;

  return (
    <div>
      <h1>Résultats de la recherche</h1>

      {sneakers.length > 0 ? (
        <>
          <p>
            {brand && <span>Marque : {brand}</span>}
            {color && <span> | Couleur : {color}</span>}
            {model && <span> | Modèle : {model}</span>}
          </p>

          <ul>
            {sneakers.map((sneaker: any) => (
              <li key={sneaker.id}>
                <h3>{sneaker.brand} - {sneaker.model}</h3>
                <p>Couleur : {sneaker.color}</p>
                <p>Prix : {sneaker.price} €</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Aucun résultat trouvé.</p>
      )}
    </div>
  );
}

export default SneakersResults;