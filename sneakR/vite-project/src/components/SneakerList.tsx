import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark } from "react-icons/fa"; // Import des icônes

interface Sneaker {
  id: number;
  brand: string;
  colorway: string;
  estimated_market_value: number;
  gender: string;
  image_url: string;
}

const SneakerListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 30px;
  background-color: #f5f5f5;
`;

const SneakerCard = styled.div`
  background-color: white;
  width: 300px;
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
  }
`;

const SneakerImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
`;

const SneakerDetails = styled.div`
  margin-top: 15px;
  padding: 10px;
`;

const SneakerTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  font-weight: 700;
  margin-bottom: 8px;
`;

const SneakerPrice = styled.div`
  font-size: 1.1rem;
  color: #555;
  font-weight: 600;
  margin-bottom: 10px;
`;

const SneakerGender = styled.div`
  font-size: 0.9rem;
  color: #777;
  margin-top: 5px;
  text-transform: capitalize;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  padding: 10px 15px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }

  &.add-to-collection {
    background-color: #28a745; /* Vert */
    color: white;

    &:hover {
      background-color: #218838; /* Vert foncé */
    }
  }

  &.add-to-wishlist {
    background-color: #007bff; /* Bleu */
    color: white;

    &:hover {
      background-color: #0056b3; /* Bleu foncé */
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
  align-items: center;
`;

const PaginationButton = styled.button`
  background-color: #28a745; /* Vert clair */
  color: white;
  font-size: 1rem;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #218838; /* Vert foncé */
    transform: translateY(-3px);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }
`;

const PageNumber = styled.span`
  font-family: "Roboto", sans-serif; /* Appliquer la police Roboto */
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const SneakerListPage = () => {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalSneakers, setTotalSneakers] = useState<number>(1969); // Nombre total de sneakers
  const [sneakersPerPage] = useState<number>(25); // Nombre d'éléments par page
  const [wishlist, setWishlist] = useState<number[]>([]); // Wishlist
  const [collection, setCollection] = useState<number[]>([]); // Collection

  // Récupérer les sneakers par page
  const fetchSneakers = async (page: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/sneakers/all`, {
        params: { page, limit: sneakersPerPage },
      });

      if (response.data.sneakers) {
        setSneakers(response.data.sneakers);
        setTotalSneakers(response.data.totalSneakers);
      } else {
        setError("Données mal formatées.");
      }
      setLoading(false);
    } catch (err) {
      setError("Une erreur est survenue lors du chargement des sneakers.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSneakers(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const storedCollection = JSON.parse(localStorage.getItem("collection") || "[]");
    setWishlist(storedWishlist);
    setCollection(storedCollection);
  }, []);

  // Ajouter à la collection
  const handleAddToCollection = (sneaker: Sneaker) => {
    const updatedCollection = [...collection, sneaker.id];
    setCollection(updatedCollection);
    localStorage.setItem("collection", JSON.stringify(updatedCollection));
    alert(`${sneaker.brand} - ${sneaker.colorway} ajouté à la collection !`);
  };

  // Ajouter à la wishlist
  const handleAddToWishlist = (sneaker: Sneaker) => {
    const updatedWishlist = [...wishlist, sneaker.id];
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    alert(`${sneaker.brand} - ${sneaker.colorway} ajouté à la wishlist !`);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  const totalPages = Math.ceil(totalSneakers / sneakersPerPage);

  return (
    <>
      <SneakerListContainer>
        {sneakers.map((sneaker) => (
          <SneakerCard key={sneaker.id}>
            <Link to={`/sneakers/${sneaker.id}`}>
              <SneakerImage
                src={sneaker.image_url}
                alt={sneaker.brand}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "default-image-url.jpg";
                }}
              />
              <SneakerDetails>
                <SneakerTitle>
                  {sneaker.brand} - {sneaker.colorway}
                </SneakerTitle>
                <SneakerPrice>{sneaker.estimated_market_value} €</SneakerPrice>
                <SneakerGender>{sneaker.gender}</SneakerGender>
              </SneakerDetails>
            </Link>
            <ButtonContainer>
              <ActionButton
                className="add-to-collection"
                onClick={() => handleAddToCollection(sneaker)}
              >
                {collection.includes(sneaker.id) ? <FaBookmark /> : <FaRegBookmark />} Ajouter à la collection
              </ActionButton>
              <ActionButton
                className="add-to-wishlist"
                onClick={() => handleAddToWishlist(sneaker)}
              >
                {wishlist.includes(sneaker.id) ? <FaHeart /> : <FaRegHeart />} Ajouter à la wishlist
              </ActionButton>
            </ButtonContainer>
          </SneakerCard>
        ))}
      </SneakerListContainer>

      <PaginationContainer>
        <PaginationButton
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </PaginationButton>
        <PageNumber>
          Page {currentPage} sur {totalPages}
        </PageNumber>
        <PaginationButton
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </PaginationButton>
      </PaginationContainer>
    </>
  );
};

export default SneakerListPage