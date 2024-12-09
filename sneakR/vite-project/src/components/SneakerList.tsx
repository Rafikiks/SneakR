import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Définir le type des données de la sneaker
interface Sneaker {
  id: number;
  brand: string;
  colorway: string;
  estimatedMarketValue: number;
  image: {
    original: string;
    "360": string[];
  };
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

const SneakerListPage = () => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSneakers = async () => {
    try {
      const response = await axios.get("http://54.37.12.181:1337/api/sneakers");
      const data = response.data;

      if (data && data.data) {
        setSneakers(
          data.data.map((item: any) => ({
            id: item.id,
            brand: item.attributes.brand,
            colorway: item.attributes.colorway,
            estimatedMarketValue: item.attributes.estimatedMarketValue,
            image: item.attributes.image,
          }))
        );
      } else {
        throw new Error("Les sneakers ne sont pas disponibles.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement des sneakers", err);
      setError("Une erreur est survenue lors du chargement des sneakers.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSneakers();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <SneakerListContainer>
      {sneakers.map((sneaker) => (
        <SneakerCard key={sneaker.id}>
          <Link to={`/sneakers/${sneaker.id}`}>
            <SneakerImage src={sneaker.image.original} alt={sneaker.brand} />
            <SneakerDetails>
              <SneakerTitle>{sneaker.brand} - {sneaker.colorway}</SneakerTitle>
              <SneakerPrice>{sneaker.estimatedMarketValue} €</SneakerPrice>
            </SneakerDetails>
          </Link>
        </SneakerCard>
      ))}
    </SneakerListContainer>
  );
};

export default SneakerListPage;