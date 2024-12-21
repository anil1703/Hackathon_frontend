import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To access URL params
import Header from '../Header/Header';
import { Container } from 'react-bootstrap';

const ItemDetails = () => {
  const { id } = useParams(); // Get the item ID from the URL params
  const [item, setItem] = useState(null); // State to hold the item details
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the item details when the component mounts
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getProductDetails/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch item details');
        }
        const data = await response.json();
        setItem(data.data); // Set the fetched item data
        setIsLoading(false); // Set loading to false
      } catch (error) {
        setError(error.message); // Handle errors
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]); // Dependency on id, will re-fetch when id changes

  return (
    <div>
      <Header />
      <Container>
        <h1>Item Details</h1>
        <div
          style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isLoading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          {item && !isLoading && !error && (
            <div>
              <h3 className="text-success"><span>Item Name  : </span>{item.Name}</h3>
              <p><strong>Category ID:</strong> {item.CategoryId}</p>
              <p><strong>Price:</strong> ${item.Price}</p>
              <p><strong>Quantity:</strong> {item.Quantity}</p>
             
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ItemDetails;
