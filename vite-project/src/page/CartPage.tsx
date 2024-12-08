import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // Si vous utilisez Axios pour les appels API

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const CartItem = styled.div`
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

const RemoveButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff1a1a;
  }
`;

const TotalContainer = styled.div`
  text-align: right;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
`;

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]); // Pour stocker les produits du panier
  const [loading, setLoading] = useState(true); // Pour gérer le chargement
  const [error, setError] = useState<string | null>(null); // Pour gérer les erreurs

  // Supposons que l'ID du produit est stocké dans un tableau ou un autre mécanisme
  const cartProductIds = [3109, 456, 1234]; // Liste d'IDs pour les produits du panier

  // Fonction pour récupérer les données du panier via l'API
  const fetchCartItems = async () => {
    try {
      const fetchedItems = await Promise.all(
        cartProductIds.map(async (id) => {
          const response = await axios.get(`http://54.37.12.181:1337/api/sneakers/${id}`);
          return response.data;
        })
      );
      setCartItems(fetchedItems); // Stocke les articles du panier dans le state
      setLoading(false);
    } catch (error) {
      setError('Erreur lors du chargement des produits du panier');
      setLoading(false);
    }
  };

  // Fonction pour retirer un article du panier
  const handleRemoveItem = async (id: number) => {
    try {
      await axios.delete(`http://54.37.12.181:1337/api/cart/${id}`); // Remplacez par l'URL de l'API pour supprimer un article
      setCartItems(cartItems.filter((item) => item.id !== id)); // Met à jour le panier localement
    } catch (error) {
      setError('Erreur lors de la suppression de l\'article');
    }
  };

  // Récupère les produits du panier au chargement de la page
  useEffect(() => {
    fetchCartItems();
  }, []); // Le tableau vide [] signifie que l'effet s'exécute une seule fois après le montage

  // Calcul du total du panier
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <CartContainer>
      <h2>Votre Panier</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Affichage des erreurs */}
      {cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        cartItems.map((item) => (
          <CartItem key={item.id}>
            <ProductDetails>
              <ProductImage src={item.imageUrl} alt={item.name} />
              <div>
                <ProductName>{item.name}</ProductName>
                <ProductSize><strong>Taille :</strong> {item.selectedSize}</ProductSize> {/* Afficher la taille */}
              </div>
            </ProductDetails>
            <ProductPrice>{item.price.toFixed(2)} €</ProductPrice>
            <RemoveButton onClick={() => handleRemoveItem(item.id)}>
              Retirer
            </RemoveButton>
          </CartItem>
        ))
      )}
      {cartItems.length > 0 && (
        <TotalContainer>Total : {totalPrice.toFixed(2)} €</TotalContainer>
      )}
    </CartContainer>
  );
};

export default CartPage;