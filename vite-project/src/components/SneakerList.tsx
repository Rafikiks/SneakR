import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Définir les types des objets sneaker
interface Sneaker {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

// Styled components pour le conteneur principal
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;  // Assurer que le contenu commence en haut
  background-color: #ffffff;  // Fond blanc pour l'ensemble de la page
  color: #000000;  // Texte noir pour contraster avec le fond
  font-family: Arial, sans-serif;
  height: 100vh;  // Prendre toute la hauteur de la page
  padding-top: 20px;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #000000;
  margin-bottom: 20px;
`;

const SneakerListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);  // 5 éléments par ligne
  gap: 20px;
  width: 80%;
  max-width: 1200px;
  padding: 20px;
  margin-top: 20px;
`;

const SneakerCard = styled.div`
  background-color: #ffffff;  // Fond blanc pour les cartes
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: #000;  // Texte noir dans la carte
  transition: transform 0.3s ease;
  height: 350px;  // Hauteur fixe pour chaque carte
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;

  &:hover {
    transform: scale(1.05);
  }
`;

const SneakerImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 200px;  // Limiter la hauteur de l'image
  object-fit: cover;  // Garder l'image propre tout en remplissant l'espace
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
`;

const SneakerName = styled.h3`
  font-size: 1.2rem;
  margin: 10px 0;
  color: #000;  // Nom en noir
`;

const SneakerBrand = styled.p`
  font-size: 1rem;
  color: #777;
  margin-bottom: 10px;
`;

const SneakerPrice = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #000;  // Prix en noir
  margin-top: 10px;
`;

const LoadingMessage = styled.p`
  font-size: 1.5rem;
  color: #000;
  text-align: center;
`;

const ErrorMessage = styled.p`
  font-size: 1.5rem;
  color: red;
  text-align: center;
`;

const SneakersList = () => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les sneakers
  const fetchSneakersData = async () => {
    try {
      const response = await axios.get(
        `http://54.37.12.181:1337/api/sneakers`
      );
      const data = response.data;

      if (data && Array.isArray(data.data)) {
        setSneakers(data.data);  // Met à jour les sneakers récupérées
      } else {
        throw new Error('Les données des sneakers ne sont pas disponibles ou sont mal formatées');
      }

      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des sneakers', err);
      setError('Une erreur est survenue lors du chargement des sneakers.');
      setLoading(false);
    }
  };

  // Charger les sneakers au premier chargement
  useEffect(() => {
    fetchSneakersData();
  }, []);

  if (loading) return <LoadingMessage>Chargement...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <Title>Liste des Sneakers</Title>
      <SneakerListContainer>
        {sneakers.map((sneaker) => (
          <SneakerCard key={sneaker.id}>
            <SneakerImage src={sneaker.imageUrl} alt={sneaker.name} />
            <SneakerName>{sneaker.name}</SneakerName>
            <SneakerBrand>{sneaker.brand}</SneakerBrand>
            <SneakerPrice>{sneaker.price} €</SneakerPrice>
          </SneakerCard>
        ))}
      </SneakerListContainer>
    </Container>
  );
};

export default SneakersList;