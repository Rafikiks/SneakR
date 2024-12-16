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
  gender: string;
  image_url: string;
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
  width: 300px;
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  }
`;

const SneakerImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
`;

const SneakerDetails = styled.div`
  margin-top: 15px;
  padding: 10px;
`;

const SneakerTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  font-weight: 700;
  margin-bottom: 8px;
`;

const SneakerPrice = styled.div`
  font-size: 1.1rem;
  color: #555;
  font-weight: 600;
  margin-bottom: 10px;
`;

const SneakerGender = styled.div`
  font-size: 0.9rem;
  color: #777;
  margin-top: 5px;
  text-transform: capitalize;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const PaginationButton = styled.button<{ isActive?: boolean }>`
  background-color: ${(props) => (props.isActive ? "#333" : "#fff")};
  color: ${(props) => (props.isActive ? "#fff" : "#333")};
  border: 1px solid #333;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #333;
    color: #fff;
  }

  &:disabled {
    background-color: #ddd;
    color: #999;
    cursor: not-allowed;
  }
`;

// Supprimer le soulignement bleu des liens
const StyledLink = styled(Link)`
  text-decoration: none; /* Enlève le soulignement bleu par défaut */
  color: inherit; /* Assure que le lien hérite de la couleur de son parent */
`;

const SneakerListPage = () => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
  const itemsPerPage = 15; // Nombre d'items par page
  const [totalPages, setTotalPages] = useState<number>(1); // Total des pages

  // Fonction pour récupérer les sneakers
  const fetchSneakers = async (page: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/sneakers`);
      const data = response.data;

      if (Array.isArray(data)) {
        const totalSneakers = data.length;
        const totalPages = Math.ceil(totalSneakers / itemsPerPage); // Calculer le nombre total de pages

        setTotalPages(totalPages);

        // Calculer les indices pour récupérer les données de la page courante
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const sneakersToShow = data.slice(startIndex, endIndex);

        setSneakers(
          sneakersToShow.map((item: any) => ({
            id: item.id,
            brand: item.brand || "Inconnu",
            colorway: item.colorway || "Inconnu",
            estimated_market_value: item.estimated_market_value || 0,
            gender: item.gender || "Non spécifié",
            image_url: item.image_url || "default-image-url.jpg",
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

  // Fonction appelée pour changer de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setLoading(true);
      fetchSneakers(newPage);
    }
  };

  // Charger les sneakers au montage du composant
  useEffect(() => {
    fetchSneakers(currentPage);
  }, [currentPage]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <SneakerListContainer>
        {sneakers.map((sneaker) => (
          <SneakerCard key={sneaker.id}>
            <StyledLink to={`/sneakers/${sneaker.id}`}>
              <SneakerImage
                src={sneaker.image_url}
                alt={sneaker.brand}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "default-image-url.jpg";
                }}
              />
              <SneakerDetails>
                <SneakerTitle>
                  {sneaker.brand} - {sneaker.colorway}
                </SneakerTitle>
                <SneakerPrice>{sneaker.estimated_market_value} €</SneakerPrice>
                <SneakerGender>{sneaker.gender}</SneakerGender>
              </SneakerDetails>
            </StyledLink>
          </SneakerCard>
        ))}
      </SneakerListContainer>

      {/* Pagination */}
      <PaginationContainer>
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Précédent
        </PaginationButton>
        <PaginationButton
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Suivant
        </PaginationButton>
      </PaginationContainer>
    </>
  );
};

export default SneakerListPage;