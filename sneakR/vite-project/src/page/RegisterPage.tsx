import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled Components
const RegisterPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  position: relative;
  padding-top: 100px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 350px;
  margin: 100px auto;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
`;

const InputField = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
`;

const SubmitButton = styled.button`
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

const StyledLink = styled(Link)`
  text-align: center;
  font-size: 1rem;
  color: #000;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const RegisterPage = () => {
  // Déclaration des états
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Fonction de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  // Typage de l'événement
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/register', {
        email,
        password,
        username,
      });
      setMessage(response.data.message);  // Message du backend
    } catch (error: any) {  // Typage de l'erreur
      setMessage(error.response ? error.response.data.message : 'Erreur serveur');
    }
  };

  return (
    <RegisterPageContainer>
      <FormContainer onSubmit={handleSubmit}>
        <h2>Inscription</h2>

        <InputField
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <SubmitButton type="submit">S'inscrire</SubmitButton>
      </FormContainer>

      {message && <p>{message}</p>}  {/* Affiche le message d'erreur ou de succès */}

      <StyledLink to="/login">Déjà un compte ? Connectez-vous</StyledLink>
    </RegisterPageContainer>
  );
};

export default RegisterPage;