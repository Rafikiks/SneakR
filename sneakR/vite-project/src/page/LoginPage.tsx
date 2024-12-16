import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Logo from '../assets/logo.png';

const LoginPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  position: relative;
  padding-top: 100px;
`;

const LogoBandContainer = styled.div`
  background-color: #fff;
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: background-color 0.3s ease;
`;

const LogoImage = styled.img`
  height: 80px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1); 
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 350px;
  width: 100%;
  aspect-ratio: 1;
  margin: 100px auto 20px auto;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: none;
  border: none;
  transition: all 0.3s ease;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  color: #000;
  margin-bottom: 30px;
`;

const InputField = styled.input`
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #000;
  }
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

const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
`;

const SocialAndSignupContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 10px;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:3001/api/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (error: any) {
      setError(error.response ? error.response.data.message : 'Une erreur est survenue.');
    }
  };

  return (
    <LoginPageContainer>
      <LogoBandContainer>
        <Link to="/">
          <LogoImage src={Logo} alt="Logo" />
        </Link>
      </LogoBandContainer>

      <FormContainer onSubmit={handleSubmit}>
        <FormTitle>Log In</FormTitle>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

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
        <SubmitButton type="submit">Se connecter</SubmitButton>
      </FormContainer>

      <SocialLoginContainer>
        <SocialAndSignupContainer>
          {/* Pas de boutons réseaux sociaux pour cette version */}
        </SocialAndSignupContainer>

        <StyledLink to="/register">Pas de compte ? Inscrivez-vous</StyledLink>
      </SocialLoginContainer>
    </LoginPageContainer>
  );
};

export default LoginPage;