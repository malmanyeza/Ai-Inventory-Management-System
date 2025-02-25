import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Modal, TextField, Typography, IconButton } from '@mui/material';
import { Add, Download, FilterList, ExpandMore, Close } from '@mui/icons-material';
import { useInventory } from '../../context/InventoryContext';

const AddProductModal = ({ open, onClose }) => {
  const { addProduct } = useInventory();
  const [productDetails, setProductDetails] = useState({
    name: '',
    unitsPerCase: '',
    pricePerCase: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async () => {
    if (!productDetails.name || !productDetails.unitsPerCase || !productDetails.pricePerCase) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await addProduct(productDetails);
      setProductDetails({ name: '', unitsPerCase: '', pricePerCase: '' });
      onClose(); // Close the modal after adding the product
    } catch (error) {
      alert("Error adding product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }
      }}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '10px',
        p: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" color="#fff">Add New Product</Typography>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}><Close /></IconButton>
        </Box>

        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField
            name="name"
            label="Product Name"
            fullWidth
            value={productDetails.name}
            onChange={handleInputChange}
            sx={inputStyles}
          />
          
          <TextField
            name="unitsPerCase"
            label="Units per Case"
            type="number"
            value={productDetails.unitsPerCase}
            onChange={handleInputChange}
            sx={inputStyles}
          />
          
          <TextField
            name="pricePerCase"
            label="Price per Case"
            type="number"
            value={productDetails.pricePerCase}
            onChange={handleInputChange}
            sx={inputStyles}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button 
            onClick={onClose}
            sx={{ 
              color: '#fff', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading} 
            variant="contained"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)', 
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            Save Product
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const inputStyles = {
  '& .MuiInputLabel-root': { color: '#fff' },
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
    '&.Mui-focused fieldset': { borderColor: 'rgba(255,255,255,0.7)' }
  }
};

const InventoryTableHeader = ({ onExportPdf, onApplyFilter }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const buttonStyle = {
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': { 
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    borderRadius: '8px',
    padding: '8px 16px',
    marginRight: '10px',
    textTransform: 'none',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
  };

  return (
    <>
      <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} />
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          mb: 2,
        }}
      >
        <Button
          startIcon={<Add />}
          onClick={() => setModalOpen(true)}
          sx={buttonStyle}
        >
          Add Product
        </Button>

        <Button
          startIcon={<Download />}
          onClick={onExportPdf}
          sx={buttonStyle}
        >
          Export PDF
        </Button>

        <Button
          startIcon={<FilterList />}
          endIcon={<ExpandMore />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={buttonStyle}
        >
          Filter
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          sx={{
            '& .MuiPaper-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              '& .MuiMenuItem-root': {
                color: '#fff',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }
            },
          }}
        >
          {['Category', 'Price Range', 'Quantity'].map((filter) => (
            <MenuItem
              key={filter}
              onClick={() => {
                onApplyFilter(filter);
                setAnchorEl(null);
              }}
              sx={{ fontSize: '0.9rem' }}
            >
              {filter}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </>
  );
};

export default InventoryTableHeader;