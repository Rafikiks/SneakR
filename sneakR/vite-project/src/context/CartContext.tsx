import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Définir l'interface d'un produit dans le panier
interface CartItem {
  id: number; // ID unique de l'article (lié à la table `cart`)
  name: string; // Nom du produit
  price: number; // Prix du produit
  image_url: string; // URL de l'image du produit
  size: string; // Taille du produit
  quantity: number; // Quantité dans le panier
}

// Définir l'interface du contexte du panier
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void; // Méthode pour vider le panier
}

// Créer le contexte du panier
const CartContext = createContext<CartContextType | undefined>(undefined);

// Le provider pour fournir le contexte au reste de l'application
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fonction pour ajouter un produit au panier via l'API et l'état local
  const addToCart = async (product: CartItem) => {
    try {
      // Vérifier si le produit existe déjà dans le panier
      const existingItem = cartItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Si l'élément existe déjà, on met à jour la quantité
        const updatedProduct = { ...existingItem, quantity: existingItem.quantity + product.quantity };
        
        // Envoyer une requête pour mettre à jour la quantité au backend
        const userId = 1; // Remplace par l'ID de l'utilisateur réel
        await axios.put(`http://localhost:3001/api/cart/${userId}/${product.id}`, updatedProduct);
        
        // Mise à jour du panier local
        setCartItems((prev) =>
          prev.map((item) => (item.id === product.id ? updatedProduct : item))
        );
        console.log('Quantité mise à jour dans le panier.');
      } else {
        // Si le produit n'existe pas dans le panier, on l'ajoute
        const userId = 1; // Remplace par l'ID de l'utilisateur réel
        const response = await axios.post('http://localhost:3001/api/cart', {
          user_id: userId,
          sneaker_id: product.id,
          quantity: product.quantity,
        });

        if (response.status === 201) {
          setCartItems((prev) => [...prev, product]);
          console.log('Produit ajouté au panier avec succès !');
        }
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout au panier :", err);
    }
  };

  // Fonction pour retirer un produit du panier via l'API et l'état local
  const removeFromCart = async (id: number) => {
    try {
      const userId = 1; // Remplace par l'ID de l'utilisateur réel
      // On envoie une requête DELETE au backend pour supprimer un produit
      const response = await axios.delete(`http://localhost:3001/api/cart/${userId}/${id}`);
      
      if (response.status === 200) {
        // Mettre à jour l'état local après suppression
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        console.log("Produit supprimé du panier avec succès !");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du panier :", err);
    }
  };

  // Optionnel : Fonction pour vider le panier via l'API
  const clearCart = async () => {
    try {
      const userId = 1; // Remplace par l'ID de l'utilisateur réel
      // Si une route pour vider tout le panier existe dans l'API
      await axios.delete(`http://localhost:3001/api/cart/${userId}`);
      setCartItems([]); // On vide localement le panier après succès
      console.log("Panier vidé avec succès !");
    } catch (err) {
      console.error("Erreur lors du vidage du panier :", err);
    }
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
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }

  return context;
};