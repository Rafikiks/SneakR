import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const WishlistContainer = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const WishlistItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProductDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  font-weight: bold;
  color: #4CAF50;
`;

const ProductSize = styled.p`
  font-size: 1rem;
  color: #333;
`;

const HeartButton = styled.button`
  background-color: transparent;
  border: none;
  color: #ff4d4d;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.3s ease;

  &:hover {
    color: #ff1a1a;
    transform: scale(1.2);
  }
`;

const TotalContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  color: #333;
`;

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const wishlistProductIds = [3109, 456, 1234];  // Liste des produits à afficher dans la wishlist

  const fetchWishlistItems = async () => {
    try {
      const fetchedItems = await Promise.all(
        wishlistProductIds.map(async (id) => {
          const response = await axios.get(`http://localhost:3001/api/wishlist/${id}`);
          if (response.status === 200 && response.data) {
            return response.data;
          }
          throw new Error('Données invalides');
        })
      );
      setWishlistItems(fetchedItems);
      setLoading(false);
    } catch (error) {
      setError('Erreur lors du chargement des produits de la wishlist');
      setLoading(false);
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/wishlist/${id}`);
      if (response.status === 200) {
        setWishlistItems(wishlistItems.filter((item) => item.id !== id));
      } else {
        setError('Erreur lors de la suppression de l\'article');
      }
    } catch (error) {
      setError('Erreur lors de la suppression de l\'article');
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const totalPrice = wishlistItems.reduce((total, item) => {
    if (item.price && !isNaN(item.price)) {
      return total + item.price;
    }
    return total;
  }, 0);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <WishlistContainer>
      <h2>Votre Wishlist</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {wishlistItems.length === 0 ? (
        <p>Votre wishlist est vide.</p>
      ) : (
        wishlistItems.map((item) => (
          <WishlistItem key={item.id}>
            <ProductDetails>
              <ProductImage src={item.imageUrl} alt={item.name} />
              <div>
                <ProductName>{item.name}</ProductName>
                <ProductSize><strong>Taille :</strong> {item.selectedSize}</ProductSize>
              </div>
            </ProductDetails>
            <ProductPrice>{item.price && !isNaN(item.price) ? item.price.toFixed(2) : 'Prix indisponible'} €</ProductPrice>
            <HeartButton onClick={() => handleRemoveItem(item.id)}>
              ❤️ Retirer
            </HeartButton>
          </WishlistItem>
        ))
      )}
      {wishlistItems.length > 0 && (
        <TotalContainer>Total : {totalPrice.toFixed(2)} €</TotalContainer>
      )}
    </WishlistContainer>
  );
};

export default WishlistPage;