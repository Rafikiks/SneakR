import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import CartPage from "./page/CartePage";
import SneakersList from "./components/SneakerList";
import SneakerDetailsPage from "./page/SneakerDetailsPage"; // Importer la page des détails

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* Afficher la Navbar seulement si on n'est pas sur la page de connexion */}
      {!isLoginPage && <Navbar />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sneakers" element={<SneakersList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/sneakers/:id" element={<SneakerDetailsPage />} /> {/* Route dynamique */}
      </Routes>
    </>
  );
};

export default App;