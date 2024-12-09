import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage"; // Import de la page d'inscription
import CartPage from "./page/CartPage";  // Chemin corrigé pour CartPage
import SneakersList from "./components/SneakerList";
import SneakerDetailsPage from "./page/SneakerDetailsPage"; // Importer la page des détails
import { CartProvider } from "./context/CartContext"; // Chemin corrigé pour CartContext

const App = () => {
  return (
    <Router>
      <CartProvider> {/* Envelopper votre application avec CartProvider */}
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
        <Route path="/register" element={<RegisterPage />} /> {/* Route pour Register */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/sneakers/:id" element={<SneakerDetailsPage />} /> {/* Route dynamique pour les détails */}
      </Routes>
    </>
  );
};

export default App;