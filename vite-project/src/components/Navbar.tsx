import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSignInAlt, FaShoppingCart } from 'react-icons/fa'; // Ajout de l'icône du panier
import Logo from '../assets/logo.png'; // Assurez-vous que le chemin est correct

// Styles pour le conteneur principal de la Navbar
const NavbarContainer = styled.nav`
  padding: 15px 20px;
  background-color: #f5f5f5;
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
  color: #333;
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

const Navbar = () => {
  return (
    <NavbarContainer>
      {/* Logo (cliquable pour aller à Sneakers List) */}
      <LogoContainer to="/sneakers">
        <LogoImage src={Logo} alt="SneakR Logo" />
      </LogoContainer>

      {/* Liens de navigation */}
      <LinksContainer>
        <StyledLink to="/">
          <FaHome /> {/* Icône de maison */}
          Accueil
        </StyledLink>
        <StyledLink to="/login">
          <FaSignInAlt /> {/* Icône de connexion */}
          Connexion
        </StyledLink>
        <StyledLink to="/cart">
          <FaShoppingCart /> {/* Icône du panier */}
          Panier
        </StyledLink>
      </LinksContainer>
    </NavbarContainer>
  );
};

export default Navbar;