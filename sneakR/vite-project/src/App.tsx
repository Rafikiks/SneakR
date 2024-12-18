import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import WishlistPage from "./page/WishlistPage";
import SneakersList from "./components/SneakerList";
import SneakerDetailsPage from "./page/SneakerDetailsPage";
import { WishlistProvider } from "./context/WishlistContext.tsx"; // Mise à jour du nom pour Wishlist
import SearchResultsPage from "./page/SearchResults"; // Page pour les résultats de recherche
import ProfilePage from "./page/ProfilePage"; // Importer la page du profil

// Page principale de l'application
const App = () => {
  return (
    <Router>
      {/* Fourniture du contexte Wishlist */}
      <WishlistProvider>
        <AppRoutes />
      </WishlistProvider>
    </Router>
  );
};

// Composant pour les routes et la logique d'affichage conditionnel de la Navbar
const AppRoutes = () => {
  const location = useLocation();

  // Masquer la Navbar sur les pages Login et Register
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* Affiche la Navbar sauf sur les pages de connexion et d'inscription */}
      {!isAuthPage && <Navbar />}

      {/* Déclaration des routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sneakers" element={<SneakersList />} />
        <Route path="/sneakers/:id" element={<SneakerDetailsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />

        {/* Routes pour l'authentification */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Nouvelle route pour le profil */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Gestion des routes non trouvées */}
        <Route path="*" element={<h2>Page non trouvée</h2>} />
      </Routes>
    </>
  );
};

export default App;