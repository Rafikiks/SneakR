import React, { useState, useEffect } from "react";
import axios from "axios";

// Interface pour les données des sneakers
interface Sneaker {
  id: number;
  brand: string;
  model: string;
}

interface UserWishlistProps {
  userId: number;
}

const UserWishlist: React.FC<UserWishlistProps> = ({ userId }) => {
  const [wishlist, setWishlist] = useState<Sneaker[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3001/api/wishlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(response.data.wishlist);
      } catch (err: any) {
        setError("Erreur lors de la récupération de la wishlist.");
        console.error(err);
      }
    };

    fetchWishlist();
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Ma Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Votre wishlist est vide.</p>
      ) : (
        <ul>
          {wishlist.map((sneaker) => (
            <li key={sneaker.id}>
              {sneaker.brand} - {sneaker.model}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserWishlist;