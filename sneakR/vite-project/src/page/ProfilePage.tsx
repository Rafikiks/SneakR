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
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Décoder le token JWT (attention : c'est une méthode basique)
      const userId = decodedToken.id;

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

  return (
    <ProfilePageContainer>
      <ProfileTitle>Mon Profil</ProfileTitle>
      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
      
      {user ? (
        <UserInfo>
          <p><strong>Nom:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Adresse:</strong> {user.address}</p> {/* Exemple d'info utilisateur */}
          {/* Vous pouvez ajouter d'autres informations selon ce que vous récupérez */}
        </UserInfo>
      ) : (
        <div>Chargement des données...</div>
      )}

      <LogoutButton onClick={handleLogout}>Se déconnecter</LogoutButton>
    </ProfilePageContainer>
  );
};

export default ProfilePage;