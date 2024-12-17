import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useWishlist } from '../context/WishlistContext.tsx'; // Utilisation de la wishlist

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

// Styles
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

const SneakerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToWishlist } = useWishlist(); // Utilisation de la wishlist
  const [sneaker, setSneaker] = useState<Sneaker | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fonction pour ajouter un produit à la wishlist
  const handleAddToWishlist = () => {
    if (sneaker) { // Vérifier que sneaker n'est pas null
      const wishlistItem = {
        id: sneaker.id,
        name: `${sneaker.brand} - ${sneaker.colorway}`,
        price: sneaker.estimatedMarketValue,
        image_url: sneaker.image_url,
      };

      addToWishlist(wishlistItem); // Ajouter à la wishlist
      alert('Produit ajouté à la wishlist !');
      navigate('/wishlist'); // Redirection vers la page wishlist
    }
  };

  return (
    <Container>
      <Title>
        {sneaker?.brand} - {sneaker?.colorway}
      </Title>

      {/* Affichage de l'image de la sneaker */}
      <SneakerImage src={sneaker?.image_url} alt={sneaker?.brand} />

      <DetailsContainer>
        <DetailItem>
          <div>Marque :</div>
          <div>{sneaker?.brand}</div>
        </DetailItem>
        <DetailItem>
          <div>Coloris :</div>
          <div>{sneaker?.colorway}</div>
        </DetailItem>
        <DetailItem>
          <div>Valeur estimée :</div>
          <div>{sneaker?.estimatedMarketValue} €</div>
        </DetailItem>
        <DetailItem>
          <div>Genre :</div>
          <div>{sneaker?.gender}</div>
        </DetailItem>
      </DetailsContainer>

      {/* Bouton pour ajouter à la wishlist */}
      <Button onClick={handleAddToWishlist}>Ajouter à la Wishlist</Button>
    </Container>
  );
};

export default SneakerDetailsPage;