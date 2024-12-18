import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from "react-icons/fa"; // Import des icônes de coeur et de collection

interface Sneaker {
  id: number;
  model: string;
  brand: string;
  color: string;
  image_url: string;
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const [sneakers, setSneakers] = useState<Sneaker[]>([]); // Déclarer les sneakers avec le type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [wishlist, setWishlist] = useState<number[]>([]); // Gérer l'état des IDs de sneakers ajoutées à la wishlist
  const [collection, setCollection] = useState<number[]>([]); // Gérer l'état des IDs de sneakers ajoutées à la collection

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        // Si les sneakers sont transmises via la location state, les utiliser
        if (location.state?.sneakers) {
          setSneakers(location.state.sneakers);
        } else {
          // Sinon, faire une requête GET vers l'API pour récupérer les sneakers
          const response = await axios.get("http://localhost:3001/api/sneakers", {
            params: { query: location.state?.query }, // Utiliser la query si présente
          });
          setSneakers(response.data); // Mettre à jour les sneakers avec les données de l'API
        }
      } catch (error) {
        setError("Une erreur est survenue lors de la récupération des sneakers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSneakers();
  }, [location.state]);

  // Fonction pour ajouter ou retirer une sneaker de la wishlist
  const toggleWishlist = (id: number) => {
    setWishlist((prevWishlist) =>
      prevWishlist.includes(id)
        ? prevWishlist.filter((item) => item !== id) // Retirer de la wishlist si déjà dedans
        : [...prevWishlist, id] // Ajouter à la wishlist si pas dedans
    );
  };

  // Fonction pour ajouter ou retirer une sneaker de la collection
  const toggleCollection = (id: number) => {
    setCollection((prevCollection) =>
      prevCollection.includes(id)
        ? prevCollection.filter((item) => item !== id) // Retirer de la collection si déjà dedans
        : [...prevCollection, id] // Ajouter à la collection si pas dedans
    );
  };

  return (
    <div className="search-results-container" style={{ padding: "20px" }}>
      <h1>Résultats de la recherche</h1>

      {/* Affichage d'un message de chargement */}
      {loading && <p>Chargement des sneakers...</p>}

      {/* Affichage des erreurs éventuelles */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Vérifier si des résultats sont trouvés */}
      {sneakers.length === 0 && !loading ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <div
          className="sneakers-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Affichage des sneakers sous forme de cartes */}
          {sneakers.map((sneaker) => (
            <Link
              to={`/sneakers/${sneaker.id}`} // Redirection vers la page de détails de la sneaker
              key={sneaker.id}
              className="sneaker-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
                textAlign: "center",
                padding: "16px",
                backgroundColor: "#fff",
                textDecoration: "none", // Enlever le soulignement du lien
                transition: "transform 0.3s ease, box-shadow 0.3s ease", // Ajout de la transition pour l'animation
              }}
              onMouseEnter={(e) => {
                // Effet au survol
                const card = e.currentTarget;
                card.style.transform = "scale(1.05)"; // Zoom léger
                card.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)"; // Ombre pour surélévation
              }}
              onMouseLeave={(e) => {
                // Retour à la position initiale
                const card = e.currentTarget;
                card.style.transform = "scale(1)"; // Annuler le zoom
                card.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; // Ombre de base
              }}
            >
              {/* Image de la sneaker */}
              <img
                src={sneaker.image_url}
                alt={sneaker.model}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
              {/* Informations de la sneaker */}
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{sneaker.model}</h3>
              <p style={{ color: "#555", marginBottom: "8px" }}>{sneaker.brand}</p>
              <p style={{ color: "#888", fontSize: "14px" }}>{sneaker.color}</p>

              {/* Boutons pour ajouter à la wishlist et à la collection */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() => toggleWishlist(sneaker.id)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                >
                  {/* Affiche un cœur plein si la sneaker est dans la wishlist */}
                  {wishlist.includes(sneaker.id) ? (
                    <FaHeart style={{ fontSize: "24px", color: "red" }} />
                  ) : (
                    <FaRegHeart style={{ fontSize: "24px", color: "#555" }} />
                  )}
                </button>
                <button
                  onClick={() => toggleCollection(sneaker.id)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                >
                  {/* Affiche un drapeau plein si la sneaker est dans la collection */}
                  {collection.includes(sneaker.id) ? (
                    <FaBookmark style={{ fontSize: "24px", color: "black" }} />
                  ) : (
                    <FaRegBookmark style={{ fontSize: "24px", color: "#555" }} />
                  )}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;