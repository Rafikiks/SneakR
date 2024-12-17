import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import WishlistPage from "./page/WishlistPage";
import SneakersList from "./components/SneakerList";
import SneakerDetailsPage from "./page/SneakerDetailsPage";
import { CartProvider } from "./context/CartContext";
import axios from "axios";

// Barre de recherche (combinée)
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Un seul champ pour la recherche
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<string>(""); // Avertissement en cas de résultats limités
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setWarning(""); // Réinitialiser l'avertissement

    try {
      const response = await axios.get("http://localhost:3001/api/sneakers", {
        params: { query: searchQuery },
      });

      // Si les résultats sont limités à 25, afficher un avertissement
      if (response.data.length === 25) {
        setWarning("La recherche est trop vague, seuls les 25 premiers résultats sont affichés.");
      }

      // Redirection vers la page des résultats
      navigate("/search-results", { state: { sneakers: response.data } });
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="search-bar" style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="Rechercher des sneakers (marque, couleur, modèle)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {isLoading ? "Recherche..." : "Rechercher"}
        </button>
      </form>
      {warning && (
        <p style={{ color: "orange", marginTop: "10px", fontSize: "14px" }}>{warning}</p>
      )}
    </div>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {sneakers.map((sneaker: any) => (
              <div key={sneaker.id} style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "4px" }}>
                <img src={sneaker.image_url} alt={sneaker.model} style={{ width: "100%", height: "auto" }} />
                <h3>{sneaker.model}</h3>
                <p>{sneaker.brand}</p>
                <p>{sneaker.color}</p>
              </div>
            ))}
          </div>
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
      {/* Afficher la Navbar sauf sur les pages de connexion ou d'inscription */}
      {!isLoginOrRegisterPage && (
        <div>
          <Navbar />
          {/* Ajouter la SearchBar ici, visible sur toutes les pages sauf connexion/inscription */}
          <SearchBar />
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sneakers" element={<SneakersList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/sneakers/:id" element={<SneakerDetailsPage />} />

        {/* Route pour afficher les résultats de la recherche */}
        <Route path="/search-results" element={<SearchResultsPage />} />
      </Routes>
    </>
  );
};

export default App;