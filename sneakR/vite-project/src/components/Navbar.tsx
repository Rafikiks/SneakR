import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSignInAlt, FaRegHeart, FaSignOutAlt } from 'react-icons/fa'; // Ajout de l'icône de déconnexion
import Logo from '../assets/logo.png'; // Assurez-vous que le chemin est correct
import SearchBar from './SearchBar';  // Importation de la SearchBar

// Styles pour le conteneur principal de la Navbar
const NavbarContainer = styled.nav`
  padding: 15px 20px;
  background-color: #f5f5f5; /* Retour à la couleur de fond initiale */
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

// Styles pour le conteneur du logo
const LogoContainer = styled(Link)` 
  display: flex;
  align-items: center;
  text-decoration: none;
`;

// Styles pour l'image du logo
const LogoImage = styled.img`
  height: 40px;
`;

// Styles pour le conteneur des liens
const LinksContainer = styled.div`
  display: flex;
  gap: 20px;
`;

// Styles pour les liens de navigation
const StyledLink = styled(Link)`
  text-decoration: none;
  color: #333; /* Couleur du texte (plus foncé) */
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px; /* Espacement entre l'icône et le texte */
  transition: color 0.3s ease;

  &:hover {
    color: #007BFF; /* Change la couleur des liens au survol */
  }
`;

// Style pour le conteneur de la barre de recherche
const SearchContainer = styled.div`
  flex-grow: 1; /* Permet à la SearchBar d'occuper tout l'espace restant */
  display: flex;
  justify-content: center; /* Centre la barre de recherche */
`;

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Vérifie si le token existe

  const handleLogout = () => {
    localStorage.removeItem('token'); // Retirer le token lors de la déconnexion
    navigate('/login'); // Rediriger vers la page de connexion
  };

  return (
    <NavbarContainer>
      {/* Logo (cliquable pour aller à Sneakers List) */}
      <LogoContainer to="/sneakers">
        <LogoImage src={Logo} alt="SneakR Logo" />
      </LogoContainer>

      {/* Conteneur de la barre de recherche */}
      <SearchContainer>
        <SearchBar />
      </SearchContainer>

      {/* Liens de navigation */}
      <LinksContainer>
        {token ? (
          <>
            <StyledLink to="/profile">Profil</StyledLink>
            <StyledLink to="/" onClick={handleLogout}>
              <FaSignOutAlt /> {/* Icône de déconnexion */}
              Déconnexion
            </StyledLink>
            <StyledLink to="/wishlist">
              <FaRegHeart /> {/* Icône de wishlist */}
              Wishlist
            </StyledLink>
          </>
        ) : (
          <>
            <StyledLink to="/">
              <FaHome /> {/* Icône de maison */}
              Accueil
            </StyledLink>
            <StyledLink to="/login">
              <FaSignInAlt /> {/* Icône de connexion */}
              Connexion
            </StyledLink>
          </>
        )}
      </LinksContainer>
    </NavbarContainer>
  );
};

export default Navbar;