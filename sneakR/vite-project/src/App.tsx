import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import WishlistPage from "./page/WishlistPage";
import SneakersList from "./components/SneakerList";
import SneakerDetailsPage from "./page/SneakerDetailsPage";
import { CartProvider } from "./context/CartContext";
import SearchResultsPage from "./page/SearchResults"; // Assurez-vous que cette page existe pour la route

// Page principale de l'application
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
      {!isLoginOrRegisterPage && <Navbar />}

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