import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import WishlistPage from "./page/WishlistPage";
import SneakersList from "./components/SneakerList";
import SneakerDetailsPage from "./page/SneakerDetailsPage";
import { CartProvider } from "./context/CartContext";
import { useState } from "react";
import axios from "axios";

// SearchBar Composant
const SearchBar = () => {
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [model, setModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Pour la redirection vers la page des résultats

  // Fonction pour effectuer la recherche
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.get('http://localhost:3001/api/sneakers/search', {
        params: { brand, color, model },
      });

      // Redirection vers la page des résultats avec les sneakers trouvés
      navigate("/search-results", { state: { sneakers: response.data } });
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        placeholder="Marque"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      <input
        type="text"
        placeholder="Couleur"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Modèle"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Recherche...' : 'Rechercher'}
      </button>
    </form>
  );
};

// Page de résultats de recherche
const SearchResultsPage = () => {
  const location = useLocation();
  const sneakers = location.state?.sneakers || [];

  return (
    <div>
      <h1>Résultats de la recherche</h1>
      <div>
        {sneakers.length === 0 ? (
          <p>Aucun produit trouvé.</p>
        ) : (
          sneakers.map((sneaker: any) => (
            <div key={sneaker.id}>
              <img src={sneaker.image_url} alt={sneaker.model} />
              <h3>{sneaker.model}</h3>
              <p>{sneaker.brand}</p>
              <p>{sneaker.color}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// App principale
const App = () => {
  return (
    <Router>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </Router>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const isLoginOrRegisterPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* Afficher la Navbar seulement si on n'est pas sur la page de connexion ou d'inscription */}
      {!isLoginOrRegisterPage && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sneakers" element={<SneakersList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/sneakers/:id" element={<SneakerDetailsPage />} />

        {/* Route pour afficher la barre de recherche */}
        <Route path="/search" element={<SearchBar />} /> {/* Page SearchBar */}

        {/* Route pour afficher les résultats de la recherche */}
        <Route path="/search-results" element={<SearchResultsPage />} /> {/* Page des résultats */}
      </Routes>
    </>
  );
};

export default App;