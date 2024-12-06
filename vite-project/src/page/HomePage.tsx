import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Fond général et structure de la page
const Container = styled.div`
  font-family: 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5; /* Fond clair pour donner de l'espace */
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  overflow-x: hidden; /* Empêche le défilement horizontal */
`;

const HeroSection = styled.section`
  width: 100%;
  height: 100vh;
  background-image: url('https://example.com/hero-image.jpg'); /* Changez l'URL par une vraie image */
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 0 40px;
  position: relative;
  background-attachment: fixed; /* Effet Parallax */
  z-index: 1;
  filter: brightness(50%); /* Assombrir un peu l'image de fond */
`;

const HeroContent = styled.div`
  z-index: 2;
  max-width: 900px;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  margin-bottom: 20px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6);
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
  max-width: 700px;
  font-weight: 300;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
`;

const ShopButton = styled(Link)`
  padding: 15px 30px;
  background-color: #000;
  color: white;
  font-size: 1.4rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #333;
    transform: translateY(-5px); /* Effet de survol avec déplacement */
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  }
`;

const SneakersGrid = styled.section`
  width: 100%;
  max-width: 1200px;
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px;
`;

const SneakerCard = styled.div`
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 20px rgba(0, 0, 0, 0.2);
  }
`;

const SneakerImage = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const SneakerInfo = styled.div`
  padding: 15px;
  text-align: center;
`;

const SneakerName = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 10px;
  font-weight: bold;
`;

const SneakerPrice = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin-top: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 20px;
`;

const HomePage = () => {
  const [sneakers, setSneakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        const response = await axios.get('http://54.37.12.181:1337/api/sneakers');
        setSneakers(response.data.data); // Structure des données de l'API
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des sneakers.');
        setLoading(false);
      }
    };

    fetchSneakers();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      {/* Section principale avec l'image de fond et texte */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Explorez les dernières sneakers</HeroTitle>
          <HeroSubtitle>La meilleure sélection de sneakers, directement à portée de main.</HeroSubtitle>
          <ShopButton to="/sneakers">Découvrez nos produits</ShopButton>
        </HeroContent>
      </HeroSection>

      {/* Section Grille des Sneakers */}
      <h2>Nos Sneakers Populaires</h2>
      <SneakersGrid>
        {sneakers.slice(0, 10).map((sneaker: any) => (
          <SneakerCard key={sneaker.id}>
            <SneakerImage src={sneaker.imageUrl} alt={sneaker.name} />
            <SneakerInfo>
              <SneakerName>{sneaker.name}</SneakerName>
              <SneakerPrice>{sneaker.price} €</SneakerPrice>
            </SneakerInfo>
          </SneakerCard>
        ))}
      </SneakersGrid>
    </Container>
  );
};

export default HomePage;