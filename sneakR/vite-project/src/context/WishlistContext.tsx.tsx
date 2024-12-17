import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

// Définir l'interface d'un produit dans la wishlist
interface WishlistItem {
  id: number; // ID unique
  name: string; // Nom du produit
  price: number; // Prix du produit
  image_url: string; // URL de l'image
}

// Définir l'interface du contexte de wishlist
interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
}

// Créer le contexte
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provider
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Ajouter un produit à la wishlist
  const addToWishlist = async (product: WishlistItem) => {
    try {
      const userId = 1; // Remplacez par l'ID utilisateur réel
      await axios.post('http://localhost:3001/api/wishlist', {
        user_id: userId,
        sneaker_id: product.id,
      });
      setWishlistItems((prev) => [...prev, product]);
      console.log('Produit ajouté à la wishlist');
    } catch (err) {
      console.error('Erreur lors de l’ajout à la wishlist :', err);
    }
  };

  // Supprimer un produit de la wishlist
  const removeFromWishlist = async (id: number) => {
    try {
      const userId = 1; // Remplacez par l'ID utilisateur réel
      await axios.delete(`http://localhost:3001/api/wishlist/${userId}/${id}`);
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      console.log('Produit supprimé de la wishlist');
    } catch (err) {
      console.error('Erreur lors de la suppression de la wishlist :', err);
    }
  };

  // Vider la wishlist
  const clearWishlist = async () => {
    try {
      const userId = 1; // Remplacez par l'ID utilisateur réel
      await axios.delete(`http://localhost:3001/api/wishlist/${userId}`);
      setWishlistItems([]);
      console.log('Wishlist vidée');
    } catch (err) {
      console.error('Erreur lors du vidage de la wishlist :', err);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Hook personnalisé
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist doit être utilisé dans un WishlistProvider");
  }
  return context;
};