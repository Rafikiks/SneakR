import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

interface Sneaker {
  id: number;
  brand: string;
  colorway: string;
  estimated_market_value: number;
  gender: string;
  image_url: string;
}

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

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
  align-items: center;
`;

const PaginationButton = styled.button`
  background-color: #28a745;  /* Vert clair */
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #218838;  /* Vert foncé au survol */
    transform: translateY(-3px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }
`;

const PageNumber = styled.span`
  font-family: 'Roboto', sans-serif;  /* Appliquer la police Roboto */
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const SneakerListPage = () => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sneakersPerPage] = useState<number>(15); // Nombre d'éléments par page

  // Fonction pour récupérer toutes les sneakers
  const fetchAllSneakers = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/sneakers/all`);
      setSneakers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des sneakers.");
      setLoading(false);
    }
  };

  // Charger toutes les sneakers au montage du composant
  useEffect(() => {
    fetchAllSneakers();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  // Découper la liste des sneakers en pages de 15 éléments
  const indexOfLastSneaker = currentPage * sneakersPerPage;
  const indexOfFirstSneaker = indexOfLastSneaker - sneakersPerPage;
  const currentSneakers = sneakers.slice(indexOfFirstSneaker, indexOfLastSneaker);

  // Fonction pour changer la page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(sneakers.length / sneakersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <SneakerListContainer>
        {currentSneakers.map((sneaker) => (
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

      <PaginationContainer>
        <PaginationButton onClick={handlePrevPage} disabled={currentPage === 1}>
          Précédent
        </PaginationButton>
        <PageNumber>
          Page {currentPage} sur {Math.ceil(sneakers.length / sneakersPerPage)}
        </PageNumber>
        <PaginationButton
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(sneakers.length / sneakersPerPage)}
        >
          Suivant
        </PaginationButton>
      </PaginationContainer>
    </>
  );
};

export default SneakerListPage;