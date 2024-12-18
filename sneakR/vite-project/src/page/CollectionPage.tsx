import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Composants stylisés
const CollectionPageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CollectionTitle = styled.h2`
  text-align: center;
`;

const ShoeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ShoeCard = styled.div`
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ShoeImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const ShoeName = styled.h3`
  font-size: 1.2rem;
  margin: 10px 0;
`;

const ShoePrice = styled.p`
  color: #777;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const CollectionPage = () => {
  const [collection, setCollection] = useState<any[]>([]); // Liste des chaussures dans la collection
  const [wishlist, setWishlist] = useState<any[]>([]); // Liste des chaussures dans la wishlist
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Pour rediriger l'utilisateur
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Si pas de token, rediriger vers la page de connexion
    } else {
      // Charger la collection de chaussures de l'utilisateur
      axios
        .get('http://localhost:3001/api/collection', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCollection(response.data.collection); // Stocker la collection
          setWishlist(response.data.wishlist); // Stocker la wishlist
        })
        .catch(() => {
          setError('Erreur lors de la récupération de la collection.');
        });
    }
  }, [token, navigate]);

  const handleAddToCollection = (shoe: any) => {
    // Ajouter une chaussure à la collection
    axios
      .post(
        'http://localhost:3001/api/collection',
        { shoeId: shoe.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setCollection([...collection, shoe]);
      })
      .catch(() => {
        setError('Erreur lors de l\'ajout à la collection.');
      });
  };

  const handleDeleteShoe = (shoeId: string) => {
    // Supprimer une chaussure de la collection
    axios
      .delete(`http://localhost:3001/api/collection/${shoeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setCollection(collection.filter((shoe) => shoe.id !== shoeId));
      })
      .catch(() => {
        setError('Erreur lors de la suppression de la chaussure.');
      });
  };

  const handleAddToWishlist = (shoe: any) => {
    // Ajouter une chaussure à la wishlist
    axios
      .post(
        'http://localhost:3001/api/wishlist',
        { shoeId: shoe.id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setWishlist([...wishlist, shoe]);
      })
      .catch(() => {
        setError('Erreur lors de l\'ajout à la wishlist.');
      });
  };

  return (
    <CollectionPageContainer>
      <CollectionTitle>Collection</CollectionTitle>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

      <ShoeList>
        {collection.map((shoe) => (
          <ShoeCard key={shoe.id}>
            <ShoeImage src={shoe.imageUrl} alt={shoe.name} />
            <ShoeName>{shoe.name}</ShoeName>
            <ShoePrice>{shoe.price} €</ShoePrice>
            <Button onClick={() => handleDeleteShoe(shoe.id)}>Supprimer</Button>
            <Button onClick={() => handleAddToWishlist(shoe)}>Ajouter à la Wishlist</Button>
            <Button onClick={() => handleAddToCollection(shoe)}>Ajouter à la Collection</Button>
          </ShoeCard>
        ))}
      </ShoeList>
    </CollectionPageContainer>
  );
};

export default CollectionPage;