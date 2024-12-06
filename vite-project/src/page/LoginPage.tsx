import styled from 'styled-components';

const LoginContainer = styled.div`
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

const LoginTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #4CAF50;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const LoginPage = () => {
  return (
    <LoginContainer>
      <LoginTitle>Connexion</LoginTitle>
      <LoginForm>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Mot de passe" />
        <SubmitButton>Se connecter</SubmitButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;