import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.get('http://localhost:3001/api/sneakers/search', {
        params: { query },
      });

      // Naviguer vers /search-results en passant les résultats
      navigate('/search-results', { state: { sneakers: response.data } });
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Rechercher par marque, couleur ou modèle"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Recherche...' : 'Rechercher'}
      </button>
    </form>
  );
}

export default SearchBar;