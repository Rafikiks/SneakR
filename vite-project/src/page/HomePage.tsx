import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Pour la navigation entre les pages

// Styled Components
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #121212;
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #4CAF50; // Couleur du titre
`;

const Description = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
  color: #ccc;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const StyledButton = styled(Link)`
  padding: 15px 30px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const HomePage = () => {
  return (
    <HomeContainer>
      <Title>Bienvenue sur SneakR</Title>
      <Description>
        Explorez une collection incroyable de sneakers rares et populaires. Connectez-vous pour
        découvrir votre prochaine paire !
      </Description>
      <ButtonGroup>
        <StyledButton to="/login">Se connecter</StyledButton>
        <StyledButton to="/sneakers">Explorer les Sneakers</StyledButton>
      </ButtonGroup>
    </HomeContainer>
  );
};

export default HomePage;