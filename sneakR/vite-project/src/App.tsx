import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";  // Import de la Navbar
import HomePage from "./page/HomePage.tsx";
import LoginPage from "./page/LoginPage.tsx";
import RegisterPage from "./page/RegisterPage.tsx";
import WishlistPage from "./page/WishlistPage.tsx";
import SneakersList from "./components/SneakerList.tsx";
import SneakerDetailsPage from "./page/SneakerDetailsPage.tsx";
import { WishlistProvider } from "./context/WishlistContext.tsx";  // Contexte Wishlist
import SearchResultsPage from "./page/SearchResults.tsx";
import ProfilePage from "./page/ProfilePage.tsx";
import CollectionPage from "./page/CollectionPage.tsx";  // Import de la CollectionPage

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
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Route pour la collection de l'utilisateur */}
        <Route path="/collection" element={<CollectionPage />} />  {/* Nouvelle route pour la collection */}

        {/* Routes pour l'authentification */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Gestion des routes non trouvées */}
        <Route path="*" element={<h2>Page non trouvée</h2>} />
      </Routes>
    </>
  );
};

export default App;