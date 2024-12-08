import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Définir l'interface d'un produit dans le panier
interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
}

// Définir l'interface du contexte du panier
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void; // Optionnel : une méthode pour vider le panier
}

// Créer le contexte du panier
const CartContext = createContext<CartContextType | undefined>(undefined);

// Le provider pour fournir le contexte au reste de l'application
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fonction pour ajouter un produit au panier via l'API et l'état local
  const addToCart = async (product: CartItem) => {
    try {
      // On envoie une requête pour ajouter l'élément au panier via l'API
      await axios.post('http://54.37.12.181:1337/api/cart', product);

      // Puis on met à jour le panier localement
      setCartItems((prev) => [...prev, product]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier :', err);
    }
  };

  // Fonction pour retirer un produit du panier via l'API et l'état local
  const removeFromCart = async (id: number) => {
    try {
      // On envoie une requête pour supprimer l'élément du panier via l'API
      await axios.delete(`http://54.37.12.181:1337/api/cart/${id}`);

      // Puis on met à jour le panier localement
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du panier :', err);
    }
  };

  // Optionnel : Fonction pour vider le panier
  const clearCart = () => {
    setCartItems([]);  // On vide simplement le panier local
  };

  // Retourner le contexte avec les valeurs et fonctions nécessaires
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour accéder au CartContext
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }

  return context;
};