import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled-components pour la SearchBar
const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 600px; /* Limite la largeur maximale */
  margin: 0 auto; /* Centrer la barre de recherche */
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 30px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
  color: #333;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
  }
`;

const SearchButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  background-color: #28a745; /* Vert */
  color: white;
  cursor: pointer;
  border-radius: 30px;
  margin-left: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #218838; /* Vert foncé au survol */
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>(""); // Un seul input
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Envoi de la requête GET
      const response = await axios.get("http://localhost:3001/api/sneakers", {
        params: { query },
      });

      console.log("Données reçues :", response.data); // Pour debug

      // Redirection vers la page des résultats
      navigate("/search-results", { state: { sneakers: response.data } });
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchBarContainer>
      <form onSubmit={handleSearch} style={{ display: "flex", width: "100%" }}>
        <SearchInput
          type="text"
          placeholder="Rechercher par marque, modèle ou couleur"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchButton type="submit" disabled={isLoading}>
          {isLoading ? "Recherche..." : "Rechercher"}
        </SearchButton>
      </form>
    </SearchBarContainer>
  );
};

export default SearchBar;