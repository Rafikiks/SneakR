import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileTitle = styled.h2`
  font-size: 2rem;
  text-align: center;
`;

const UserInfo = styled.div`
  margin: 20px 0;
  font-size: 1.2rem;
`;

const LogoutButton = styled.button`
  padding: 12px;
  font-size: 1rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444;
  }
`;

const ProfilePicture = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
`;

const CollectionButton = styled.button`
  padding: 12px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null); // Stocker les infos utilisateur
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage

  useEffect(() => {
    if (!token) {
      navigate('/login'); // Si pas de token, rediriger vers la page de connexion
    } else {
      // Décode le token pour récupérer l'ID de l'utilisateur
      const decodedToken: any = JSON.parse(atob(token.split('.')[1])); // Décoder le token JWT
      const userId = decodedToken.sub; // Utiliser "sub" au lieu de "id"

      // Log de debug pour vérifier les valeurs du token et de l'ID utilisateur
      console.log("Decoded Token:", decodedToken);
      console.log("User ID:", userId);

      // Vérifier si userId est défini avant de faire la requête
      if (!userId) {
        console.error("ID utilisateur non trouvé dans le token.");
        return;
      }

      // Récupérer les infos de l'utilisateur avec l'ID dans l'URL
      axios
        .get(`http://localhost:3001/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data); // Si la requête est réussie, stocker les données utilisateur
        })
        .catch(() => {
          setError('Impossible de récupérer les données du profil.');
        });
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Retirer le token
    navigate('/login'); // Rediriger vers la page de connexion
  };

  const handleGoToCollection = () => {
    navigate('/collection'); // Naviguer vers la page de collection de chaussures
  };

  return (
    <ProfilePageContainer>
      <ProfileTitle>Mon Profil</ProfileTitle>
      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
      
      {user ? (
        <UserInfo>
          <ProfilePicture src={user.profilePicture || '/default-profile-pic.jpg'} alt="Profile" />
          <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Adresse:</strong> {user.address || 'Non spécifiée'}</p> {/* Exemple d'info utilisateur */}
        </UserInfo>
      ) : (
        <div>Chargement des données...</div>
      )}

      <CollectionButton onClick={handleGoToCollection}>Voir ma collection de chaussures</CollectionButton>
      <LogoutButton onClick={handleLogout}>Se déconnecter</LogoutButton>
    </ProfilePageContainer>
  );
};

export default ProfilePage;