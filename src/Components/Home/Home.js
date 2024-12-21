import React, { useEffect, useState } from "react";
import "./Home.css";
import { Container } from "react-bootstrap";
import Header from "../Header/Header";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

const Home = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 7; 

  const [refresh, setRefresh] = useState(false);

 
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/allProducts");
        const data = await response.json();
        if (data && data.data) {
          setItems(data.data); 
          setFilteredItems(data.data); 
        } else {
          setError("Invalid data format");
        }
        setIsLoaded(true);
      } catch (error) {
        setError(error.message);
        setIsLoaded(true);
      }
    };
    fetchItems();
  }, [refresh]);


  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.Name.toLowerCase().includes(search.toLowerCase()) ||
        item.ItemId.toLowerCase().includes(search.toLowerCase()) ||
        item.CategoryId.toString().includes(search) || 
        item.Price.toString().includes(search) || 
        item.Quantity.toString().includes(search) 
    );
    setFilteredItems(filtered);
  }, [search, items]);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);


  const handleViewDetails = (id) => {
    console.log("View details for item ID:", id);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setOpen(true); 
    setRefresh(!refresh);
  };

  const handleDeleteItem = async (id) => {
 
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
  
    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/deleteProduct/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          
          setRefresh(!refresh);
        } else {
          console.error("Failed to delete the item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    } else {
      // User canceled the deletion, no action needed
      console.log("Deletion canceled.");
    }
  };

  
  const handleUpdateItem = async () => {
    if (!selectedItem) return;
  
    // Validation: Check for missing fields
    const requiredFields = ["ItemId", "Name", "CategoryId", "Price", "Quantity"];
    const missingFields = requiredFields.filter((field) => !selectedItem[field]);
  
    if (missingFields.length > 0) {
      alert(`Please fill in the missing fields: ${missingFields.join(", ")}`);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/updateProduct/${selectedItem.ItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedItem),
      });
  
      if (response.ok) {
        const contentType = response.headers.get("content-type");
  
       
        if (contentType && contentType.includes("application/json")) {
          const updatedItem = await response.json();
          console.log("Updated item:", updatedItem);
        } else {
          const textResponse = await response.text();
          console.log("Response text:", textResponse);
        }
  
        setOpen(false); 
        setRefresh(!refresh); 
      } else {
        console.error("Failed to update the item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  
  
  
  const handleCloseModal = () => {
    setOpen(false);
    setSelectedItem(null); 
  };


  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Header />
      <Container>
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ marginBottom: "20px" }}
        >
          <h1>Items</h1>
          <div>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by ItemId, Name, CategoryId, Price, or Quantity"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginRight: "10px" }}
            />
          </div>
        </div>

        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!isLoaded ? (
          <CircularProgress />
        ) : (
          <TableContainer style={{ marginTop: "20px" }} component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="items table">
              <TableHead>
                <TableRow>
                  <TableCell>Item ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category ID</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell component="th" scope="row">
                      {item.ItemId}
                    </TableCell>
                    <TableCell>{item.Name}</TableCell>
                    <TableCell>{item.CategoryId}</TableCell>
                    <TableCell>{item.Price}</TableCell>
                    <TableCell>{item.Quantity}</TableCell>
                    <TableCell>
                      <Link to={`/items/${item.ItemId}`}>
                        <Button
                          variant="outlined"
                          color="primary"
                          style={{ marginRight: "5px" }}
                          onClick={() => handleViewDetails(item.ItemId)}
                        >
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="outlined"
                        color="success"
                        style={{ marginRight: "5px" }}
                        onClick={() => handleEditItem(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteItem(item.ItemId)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Stack
          spacing={2}
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination
            count={Math.ceil(filteredItems.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>

      
        <Modal open={open} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>Edit Item</Typography>
            <TextField
              label="Item ID"
              fullWidth
              value={selectedItem?.ItemId || ""}
              onChange={(e) => setSelectedItem({ ...selectedItem, ItemId: e.target.value })}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Name"
              fullWidth
              value={selectedItem?.Name || ""}
              onChange={(e) => setSelectedItem({ ...selectedItem, Name: e.target.value })}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Category ID"
              fullWidth
              value={selectedItem?.CategoryId || ""}
              onChange={(e) => setSelectedItem({ ...selectedItem, CategoryId: e.target.value })}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Price"
              fullWidth
              value={selectedItem?.Price || ""}
              onChange={(e) => setSelectedItem({ ...selectedItem, Price: e.target.value })}
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="Quantity"
              fullWidth
              value={selectedItem?.Quantity || ""}
              onChange={(e) => setSelectedItem({ ...selectedItem, Quantity: e.target.value })}
              style={{ marginBottom: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateItem}
              style={{ marginTop: "10px" }}
            >
              Update Item
            </Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default Home;
