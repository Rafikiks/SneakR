import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Champ unique pour la recherche
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [warning] = useState<string>(''); // Avertissement pour les résultats limités
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Crée un objet params vide mais correctement typé
      const params: { [key: string]: string | undefined } = {};
  
      // Ajoute les paramètres si ils sont définis (en s'assurant qu'ils ne sont pas undefined)
      if (brand) params['brand'] = brand;
      if (color) params['color'] = color;
      if (model) params['model'] = model;
  
      // Envoi de la requête GET avec les filtres
      const response = await axios.get('http://localhost:3001/api/sneakers', { params });
  
      // Redirection vers la page des résultats avec les sneakers et les paramètres de recherche
      navigate("/search-results", { state: { sneakers: response.data } });
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="text"
          placeholder="Rechercher des sneakers (ex : Nike rouge)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {isLoading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>
      {warning && (
        <p style={{ color: 'orange', marginTop: '10px', fontSize: '14px' }}>
          {warning}
        </p>
      )}
    </div>
  );
};

export default SearchBar;