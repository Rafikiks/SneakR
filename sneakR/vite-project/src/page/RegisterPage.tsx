import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import GoogleLogo from '../assets/google-logo.png';
import FacebookLogo from '../assets/facebook-logo.png';
import AppleLogo from '../assets/apple-logo.png';
import XLogo from '../assets/x-logo.png';
import Logo from '../assets/logo.png';

const RegisterPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  position: relative;
  padding-top: 100px; /* Décale le contenu du haut */
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
  max-width: 350px; /* Largeur max du formulaire */
  width: 100%;
  aspect-ratio: 1; /* Force une forme carrée */
  margin: 100px auto 20px auto; /* Décale le formulaire vers le bas */
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: none; /* Retirer l'ombre */
  border: none; /* Retirer la bordure */
  transition: all 0.3s ease;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  color: #000;
  margin-bottom: 30px; /* Espacement sous le titre */
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

const SocialButton = styled.button`
  padding: 8px;
  font-size: 1rem;
  color: black;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f2f2f2;
  }

  img {
    height: 24px; /* Réduire la taille des icônes */
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <RegisterPageContainer>
      {/* Bandeau avec le logo */}
      <LogoBandContainer>
        <Link to="/">
          <LogoImage src={Logo} alt="Logo" />
        </Link>
      </LogoBandContainer>

      <FormContainer onSubmit={handleSubmit}>
        <FormTitle>Inscription</FormTitle>

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

      <SocialLoginContainer>
        <SocialAndSignupContainer>
          <SocialButton>
            <img src={GoogleLogo} alt="Google" />
          </SocialButton>
          <SocialButton>
            <img src={AppleLogo} alt="Apple" />
          </SocialButton>
          <SocialButton>
            <img src={FacebookLogo} alt="Facebook" />
          </SocialButton>
          <SocialButton>
            <img src={XLogo} alt="X" />
          </SocialButton>
        </SocialAndSignupContainer>

        {/* Lien vers la page de connexion */}
        <StyledLink to="/login">Déjà un compte ? Connectez-vous</StyledLink>
      </SocialLoginContainer>
    </RegisterPageContainer>
  );
};

export default RegisterPage;