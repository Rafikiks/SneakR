import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Fond général et structure de la page
const Container = styled.div`
  font-family: 'Helvetica Neue', sans-serif;
  background-color: #f5f5f5;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroContent = styled.div`
  z-index: 2;
  text-align: center;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  display: inline-block;
  
  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 1rem;
    padding: 12px 20px;
  }

  &:hover {
    background-color: #333;
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  }
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

// Carrousel styles
const CarouselWrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  overflow: hidden;
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease;
`;

const CarouselImage = styled.div<{ imageUrl: string }>`
  width: 100vw;
  height: 100vh;
  background-image: ${(props) => `url(${props.imageUrl})`};
  background-size: cover;
  background-position: center;
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const PrevButton = styled(CarouselButton)`
  left: 10px;
`;

const NextButton = styled(CarouselButton)`
  right: 10px;
`;

const HomePage = () => {
  const [sneakers, setSneakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleSneakers, setVisibleSneakers] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        const response = await axios.get('http://54.37.12.181:1337/api/sneakers');
        const data = response.data.data;

        // Mise à jour des sneakers et sélection de quelques images pour le carrousel
        setSneakers(data);
        const selectedImages = data.slice(0, 4).map((sneaker: any) => sneaker.attributes.image.original);
        setCarouselImages(selectedImages);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des sneakers.');
        setLoading(false);
      }
    };

    fetchSneakers();
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
  };

  const loadMoreSneakers = () => {
    setVisibleSneakers(visibleSneakers + 10); // Augmenter de 10 sneakers à chaque clic
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Container>
      <HeroSection>
        <CarouselWrapper>
          <CarouselTrack style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {carouselImages.map((image, index) => (
              <CarouselImage key={index} imageUrl={image} />
            ))}
          </CarouselTrack>

          <PrevButton onClick={goToPrev}>‹</PrevButton>
          <NextButton onClick={goToNext}>›</NextButton>
        </CarouselWrapper>

        <HeroContent>
          <HeroTitle>Explorez les dernières sneakers</HeroTitle>
          <HeroSubtitle>La meilleure sélection de sneakers, directement à portée de main.</HeroSubtitle>
          <ShopButton to="/sneakers">Découvrez nos produits</ShopButton>
        </HeroContent>
      </HeroSection>

      <h2>Nos Sneakers Populaires</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {sneakers.slice(0, visibleSneakers).map((sneaker: any) => (
          <SneakerCard key={sneaker.id}>
            <SneakerImage src={sneaker.attributes.image.original} alt={sneaker.attributes.name} />
            <SneakerInfo>
              <SneakerName>{sneaker.attributes.name}</SneakerName>
              <SneakerPrice>{sneaker.attributes.retailPrice} €</SneakerPrice>
            </SneakerInfo>
          </SneakerCard>
        ))}
      </div>

      {visibleSneakers < sneakers.length && (
        <button onClick={loadMoreSneakers}>Voir plus</button>
      )}
    </Container>
  );
};

export default HomePage;