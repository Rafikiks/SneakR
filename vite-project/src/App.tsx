import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Barre de navigation mise à jour
import HomePage from './page/HomePage';
import SneakersList from './components/SneakerList';
import LoginPage from './page/LoginPage';

const App = () => {
  return (
    <Router>
      {/* La barre de navigation visible sur toutes les pages */}
      <Navbar />
      <Routes>
        {/* Définir les routes pour naviguer */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sneakers" element={<SneakersList />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;