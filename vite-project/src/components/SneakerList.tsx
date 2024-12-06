import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Style global du conteneur principal
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;  // Aligne tout en haut pour centrer verticalement
  flex-direction: column;  // Centrer tout le contenu verticalement
  height: 100vh; /* Prend toute la hauteur de l'écran */
  background-color: #121212; /* Fond sombre */
  color: white;
  font-family: Arial, sans-serif;
`;

// Style pour le conteneur de la liste des sneakers
const SneakerListContainer = styled.div`
  width: 80%;
  max-width: 1200px;
  text-align: center;
  margin-top: 40px; // Ajout d'espace sous la barre de navigation
`;

// Conteneur pour les cartes de sneakers avec affichage en grille
const SneakerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;

// Style des cartes de chaque sneaker
const SneakerCard = styled.div`
  display: inline-block;
  width: 250px;
  margin: 20px;
  padding: 15px;
  background-color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

// Image du sneaker avec un peu de marge en bas
const SneakerImage = styled.img`
  width: 100%;
  height: auto;
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
`;

// Nom du sneaker avec un peu de marge
const SneakerName = styled.h3`
  font-size: 1.2rem;
  margin: 10px 0;
  color: #333;
`;

// Marque du sneaker, un peu plus petit
const SneakerBrand = styled.p`
  font-size: 1rem;
  color: #777;
  margin-bottom: 10px;
`;

// Prix du sneaker, en vert et un peu plus gros
const SneakerPrice = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #4CAF50;
`;

// Message de chargement
const LoadingMessage = styled.p`
  font-size: 1.5rem;
  text-align: center;
  color: #999;
`;

// Message d'erreur
const ErrorMessage = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: red;
`;

const SneakersList = () => {
  const [sneakers, setSneakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSneakersData = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/sneakers'); // Assurez-vous que l'URL est correcte
        setSneakers(response.data); // Assurez-vous que la structure de l'API est correcte
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des sneakers', err);
        setError('Une erreur est survenue lors du chargement des sneakers.');
        setLoading(false);
      }
    };
    fetchSneakersData();
  }, []);

  if (loading) return <LoadingMessage>Chargement...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <SneakerListContainer>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Liste des sneakers</h2>
        <SneakerContainer>
          {sneakers.map((sneaker) => (
            <SneakerCard key={sneaker.id}>
              <SneakerImage src={sneaker.imageUrl} alt={sneaker.name} />
              <SneakerName>{sneaker.name}</SneakerName>
              <SneakerBrand>{sneaker.brand}</SneakerBrand>
              <SneakerPrice>{sneaker.price} €</SneakerPrice>
            </SneakerCard>
          ))}
        </SneakerContainer>
      </SneakerListContainer>
    </Container>
  );
};

export default SneakersList;