import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Rechercher par marque, modèle ou couleur"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Recherche..." : "Rechercher"}
      </button>
    </form>
  );
};

export default SearchBar;