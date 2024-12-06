import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.png'; // Assurez-vous que ce chemin est correct

// Styles pour le conteneur principal de la Navbar
const NavbarContainer = styled.nav`
  padding: 15px 20px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Ombre sous la barre */
`;

// Styles pour le conteneur du logo
const LogoContainer = styled(Link)` /* Le logo est un lien pour naviguer */
  display: flex;
  align-items: center;
  cursor: pointer; /* Change le curseur pour indiquer un clic */
  transition: transform 0.3s ease; /* Animation au survol */

  &:hover {
    transform: scale(1.1); /* Agrandit légèrement le logo au survol */
  }

  &:active {
    transform: scale(0.9); /* Réduit légèrement le logo au clic */
  }
`;

// Styles pour l'image du logo
const LogoImage = styled.img`
  height: 40px; /* Ajustez la hauteur du logo */
  width: auto; /* Maintient le ratio de l'image */
`;

// Styles pour le conteneur des liens
const LinksContainer = styled.div`
  display: flex;
  gap: 20px; /* Espacement entre les liens */
`;

// Styles pour les liens de navigation
const StyledLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: bold;
  font-size: 1rem;
  transition: color 0.3s ease, transform 0.2s ease; /* Animation couleur et clic */

  &:hover {
    color: #007BFF; /* Change la couleur des liens au survol */
  }

  &:active {
    transform: scale(0.95); /* Réduit légèrement le texte au clic */
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      {/* Logo cliquable (redirige vers Sneakers List) */}
      <LogoContainer to="/sneakers">
        <LogoImage src={Logo} alt="SneakR Logo" />
      </LogoContainer>

      {/* Liens de navigation */}
      <LinksContainer>
        <StyledLink to="/">Accueil</StyledLink>
        <StyledLink to="/login">Connexion</StyledLink>
      </LinksContainer>
    </NavbarContainer>
  );
};

export default Navbar;