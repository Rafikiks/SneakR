import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import HomePage from "./page/HomePage.tsx";
import LoginPage from "./page/LoginPage.tsx";
import RegisterPage from "./page/RegisterPage.tsx";
import WishlistPage from "./page/WishlistPage.tsx";
import SneakersList from "./components/SneakerList.tsx";
import SneakerDetailsPage from "./page/SneakerDetailsPage.tsx";
import { WishlistProvider } from "./context/WishlistContext.tsx.tsx"; // Mise à jour du nom pour Wishlist
import SearchResultsPage from "./page/SearchResults.tsx"; // Page pour les résultats de recherche
import ProfilePage from "./page/ProfilePage.tsx"; // Importer la page du profil

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