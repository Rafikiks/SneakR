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
  image_url: string;
  links: {
    goat: string;
    stockX: string;
    flightClub: string;
    stadiumGoods: string;
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
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Récupération des détails de la sneaker depuis l'API
  const fetchSneakerDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/sneakers/${id}`
      );
      const data = response.data;

      if (data) {
        setSneaker({
          id: data.id,
          brand: data.brand,
          colorway: data.colorway,
          estimatedMarketValue: data.estimated_market_value,
          gender: data.gender,
          image_url: data.image_url,
          links: data.links,
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

  // Fonction pour ajouter un produit au panier
  const handleAddToCart = () => {
    if (selectedSize && sneaker) {  // Vérifier que sneaker n'est pas null ou undefined
      const cartItem = {
        id: sneaker.id,  // ID du produit
        name: `${sneaker.brand} - ${sneaker.colorway}`,  // Nom du produit avec la marque et la couleur
        price: sneaker.estimatedMarketValue,  // Prix du produit
        image_url: sneaker.image_url,  // URL de l'image (correspond à la clé image_url dans CartItem)
        size: selectedSize,  // Taille sélectionnée
        quantity: 1,  // Quantité par défaut
      };

      addToCart(cartItem);  // Ajouter l'article au panier via le contexte
      navigate('/cart');  // Redirection vers la page du panier
    } else {
      alert('Veuillez sélectionner une taille avant d\'ajouter au panier.');
    }
  };

  return (
    <Container>
      <Title>
        {sneaker?.brand} - {sneaker?.colorway}
      </Title>

      {/* Affichage de l'image de la sneaker */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <SneakerImage
          src={sneaker?.image_url}
          alt={sneaker?.brand}
        />
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