import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';

interface Sneaker {
  id: number;
  brand: string;
  colorway: string;
  estimatedMarketValue: number;
  gender: string;
  image: {
    original: string;
    '360': string[];
  };
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #333;
  font-family: 'Arial', sans-serif;
  padding: 40px 20px;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
`;

const SneakerImage = styled.img`
  width: 280px;
  height: 280px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const DetailsContainer = styled.div`
  width: 80%;
  max-width: 700px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-top: 30px;
`;

const DetailItem = styled.div`
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DetailLabel = styled.div`
  font-weight: 600;
  color: #666;
`;

const DetailValue = styled.div`
  color: #333;
  font-weight: 400;
`;


const Button = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #555;
  }
`;

const LoadingMessage = styled.div`
  font-size: 1.2rem;
  color: #333;
  text-align: center;
`;

const ErrorMessage = styled.div`
  font-size: 1.2rem;
  color: red;
  text-align: center;
`;

const SizeSelector = styled.select`
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 20px;
`;

const SneakerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();  // Utilisation de la fonction addToCart depuis le contexte du panier
  const [sneaker, setSneaker] = useState<Sneaker | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Récupération des détails de la sneaker depuis l'API
  const fetchSneakerDetails = async () => {
    try {
      const response = await axios.get(
        `http://54.37.12.181:1337/api/sneakers/${id}`
      );
      const data = response.data;

      if (data && data.data) {
        setSneaker({
          id: data.data.id,
          brand: data.data.attributes.brand,
          colorway: data.data.attributes.colorway,
          estimatedMarketValue: data.data.attributes.estimatedMarketValue,
          gender: data.data.attributes.gender,
          image: data.data.attributes.image,
        });
      } else {
        throw new Error('Les détails de la sneaker ne sont pas disponibles.');
      }

      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des détails', err);
      setError('Une erreur est survenue lors du chargement des détails.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSneakerDetails();
  }, [id]);

  if (loading) return <LoadingMessage>Chargement...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  // Fonction pour changer l'image en fonction du mouvement de la souris
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sneaker && sneaker.image['360'].length > 0) {
      const imageWidth = e.currentTarget.offsetWidth; // Récupère la largeur de l'élément contenant l'image
      const mouseX = e.nativeEvent.offsetX; // Position horizontale de la souris dans l'élément
      const index = Math.floor((mouseX / imageWidth) * sneaker.image['360'].length); // Calcul de l'index de l'image
      setCurrentImageIndex(index); // Met à jour l'index de l'image affichée
    }
  };

  // Fonction pour ajouter un produit au panier
  const handleAddToCart = () => {
    if (selectedSize) {
      const cartItem = {
        id: sneaker?.id!,
        name: sneaker?.brand!,
        price: sneaker?.estimatedMarketValue!,
        imageUrl: sneaker?.image.original!,
        size: selectedSize,
      };

      addToCart(cartItem); // Ajouter l'article au panier via le contexte
      navigate('/cart'); // Redirection vers la page du panier
    } else {
      alert('Veuillez sélectionner une taille avant d\'ajouter au panier.');
    }
  };

  return (
    <Container>
      <Title>
        {sneaker?.brand} - {sneaker?.colorway}
      </Title>

      {/* Section de l'image de la sneaker */}
      <div
        onMouseMove={handleMouseMove} // Détection du mouvement de la souris
        style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}
      >
        {sneaker?.image['360'] && sneaker.image['360'].length > 0 ? (
          <SneakerImage
            src={sneaker.image['360'][currentImageIndex]} // Image actuelle en fonction du mouvement de la souris
            alt={sneaker?.brand}
          />
        ) : (
          <SneakerImage src={sneaker?.image.original} alt={sneaker?.brand} />
        )}
      </div>

      <DetailsContainer>
        <DetailItem>
          <DetailLabel>Marque</DetailLabel>
          <DetailValue>{sneaker?.brand}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Coloris</DetailLabel>
          <DetailValue>{sneaker?.colorway}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Valeur estimée</DetailLabel>
          <DetailValue>{sneaker?.estimatedMarketValue} €</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Genre</DetailLabel>
          <DetailValue>{sneaker?.gender}</DetailValue>
        </DetailItem>
      </DetailsContainer>

      <SizeSelector onChange={(e) => setSelectedSize(e.target.value)} value={selectedSize}>
        <option value="">Sélectionner une taille</option>
        <option value="39">39</option>
        <option value="40">40</option>
        <option value="41">41</option>
        <option value="42">42</option>
        <option value="43">43</option>
        <option value="44">44</option>
        <option value="45">45</option>
      </SizeSelector>

      <Button onClick={handleAddToCart}>Ajouter au panier</Button>
    </Container>
  );
};

export default SneakerDetailsPage;