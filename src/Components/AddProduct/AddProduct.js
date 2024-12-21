import React, { useState } from 'react';
import Header from '../Header/Header';
import { Container } from 'react-bootstrap';
import { TextField, Button } from '@mui/material';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    Name: '',
    CategoryId: '',
    Price: '',
    Quantity: '',
  });

  const [error, setError] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!productData.Name || !productData.CategoryId || !productData.Price || !productData.Quantity) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/createProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Product added successfully');
        // Reset form
        setProductData({
          Name: '',
          CategoryId: '',
          Price: '',
          Quantity: '',
        });
        setError(null);
      } else {
        throw new Error('Failed to add product');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Header />
      <Container>
        <h1>Add Product</h1>
        <div
          style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <form
            style={{ width: '100%', maxWidth: '400px' }}
            onSubmit={handleSubmit}
          >
            <TextField
              label="Product Name"
              name="Name"
              variant="outlined"
              fullWidth
              value={productData.Name}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Category ID"
              name="CategoryId"
              variant="outlined"
              fullWidth
              type="number"
              value={productData.CategoryId}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Price"
              name="Price"
              variant="outlined"
              fullWidth
              type="number"
              value={productData.Price}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Quantity"
              name="Quantity"
              variant="outlined"
              fullWidth
              type="number"
              value={productData.Quantity}
              onChange={handleInputChange}
              style={{ marginBottom: '20px' }}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Button type="submit" variant="contained" color="primary">
              Add Product
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default AddProduct;
