import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Définir le type des données de la sneaker
interface Sneaker {
  id: number;
  brand: string;
  colorway: string;
  estimated_market_value: number;
  gender: string; // Ajout du champ gender
  image_url: string;
  links: {
    stockX: string;
    goat: string;
    flightClub: string;
    stadiumGoods: string;
  };
}

// Styled Components
const SneakerListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 30px;
  background-color: #f5f5f5;
`;

const SneakerCard = styled.div`
  background-color: white;
  width: 250px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  padding: 15px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const SneakerImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
`;

const SneakerDetails = styled.div`
  margin-top: 15px;
`;

const SneakerTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 10px;
`;

const SneakerPrice = styled.div`
  font-size: 1rem;
  color: #888;
  font-weight: 500;
`;

const SneakerGender = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-top: 5px;
`;

const LinkContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SneakerListPage = () => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Nombre d'items à afficher (une seule page de 25 sneakers)
  const itemsPerPage = 25;

  // Fonction pour récupérer les sneakers
  const fetchSneakers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/sneakers");
      const data = response.data;

      // Vérifier la structure des données
      if (Array.isArray(data)) {
        // Limiter les sneakers à un maximum de 25
        const limitedSneakers = data.slice(0, itemsPerPage);
        
        setSneakers(
          limitedSneakers.map((item: any) => ({
            id: item.id,
            brand: item.brand || "Inconnu",
            colorway: item.colorway || "Inconnu",
            estimated_market_value: item.estimated_market_value || 0,
            gender: item.gender || "Non spécifié", // Ajout du genre
            image_url: item.image_url && item.image_url.length > 0 ? item.image_url : "default-image-url.jpg", // Image par défaut si vide
            links: item.links || {},
          }))
        );
      } else {
        throw new Error("La réponse de l'API est mal formatée.");
      }

      setLoading(false);
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des sneakers.");
      setLoading(false);
    }
  };

  // Chargement des sneakers au montage du composant
  useEffect(() => {
    fetchSneakers();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <SneakerListContainer>
        {sneakers.map((sneaker) => (
          <SneakerCard key={sneaker.id}>
            <Link to={`/sneakers/${sneaker.id}`}>
              <SneakerImage
                src={sneaker.image_url}
                alt={sneaker.brand}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "default-image-url.jpg"; // Image par défaut en cas d'erreur
                }}
              />
              <SneakerDetails>
                <SneakerTitle>
                  {sneaker.brand} - {sneaker.colorway}
                </SneakerTitle>
                <SneakerPrice>{sneaker.estimated_market_value} €</SneakerPrice>
                <SneakerGender>{sneaker.gender}</SneakerGender> {/* Affichage du genre */}
              </SneakerDetails>
            </Link>

            {/* Liens vers d'autres plateformes */}
            <LinkContainer>
              {sneaker.links.goat && (
                <a href={sneaker.links.goat} target="_blank" rel="noopener noreferrer">
                  Goat
                </a>
              )}
              {sneaker.links.stockX && (
                <a href={sneaker.links.stockX} target="_blank" rel="noopener noreferrer">
                  StockX
                </a>
              )}
              {sneaker.links.flightClub && (
                <a href={sneaker.links.flightClub} target="_blank" rel="noopener noreferrer">
                  FlightClub
                </a>
              )}
              {sneaker.links.stadiumGoods && (
                <a href={sneaker.links.stadiumGoods} target="_blank" rel="noopener noreferrer">
                  Stadium Goods
                </a>
              )}
            </LinkContainer>
          </SneakerCard>
        ))}
      </SneakerListContainer>
    </>
  );
};

export default SneakerListPage;