import React, { useContext, useState } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCustomers } from '../../context/CustomersContext';

const AddNewCustomerModal = ({ open, onClose }) => {
  const { addCustomer } = useCustomers();

  const [formData, setFormData] = useState({
    tradeName: '',
    registeredName: '',
    vatNumber: '',
    tinNumber: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCustomer = async () => {

    try {
      await addCustomer(formData);
      setFormData({
        tradeName: '',
        registeredName: '',
        vatNumber: '',
        tinNumber: '',
        email: '',
        phone: '',
        address: ''
      });
      onClose();
    } catch (error) {
      alert("Error adding customer: " + error.message);
    }
  }

  return (
    <Modal 
      open={open} 
      onClose={onClose}
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
        width: 600,
        maxHeight: '90vh',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 3,
          backgroundColor: 'rgba(255,255,255,0.05)',
          flexShrink: 0
        }}>
          <Typography variant="h6" sx={{ color: '#fff' }}>Add New Customer</Typography>
          <IconButton onClick={onClose} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{
          overflowY: 'auto',
          px: 3,
          pb: 3,
          flex: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '10px',
            border: '2px solid rgba(255,255,255,0.3)',
          }
        }}>
          <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
            <TextField
              name="tradeName"
              label="Trade Name"
              fullWidth
              value={formData.tradeName}
              onChange={handleInputChange}
              sx={inputStyles}
            />
            
            <TextField
              name="registeredName"
              label="Registered Name"
              fullWidth
              value={formData.registeredName}
              onChange={handleInputChange}
              sx={inputStyles}
            />
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                name="vatNumber"
                label="VAT Number"
                value={formData.vatNumber}
                onChange={handleInputChange}
                sx={inputStyles}
              />
              
              <TextField
                name="tinNumber"
                label="TIN Number"
                value={formData.tinNumber}
                onChange={handleInputChange}
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                sx={inputStyles}
              />
              
              <TextField
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                sx={inputStyles}
              />
            </Box>

            <TextField
              name="address"
              label="Physical Address"
              multiline
              rows={3}
              value={formData.address}
              onChange={handleInputChange}
              sx={inputStyles}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2,
          p: 3,
          backgroundColor: 'rgba(255,255,255,0.05)',
          flexShrink: 0
        }}>
          <Button 
            onClick={onClose}
            sx={{ 
              color: '#fff', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              minWidth: 100
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveCustomer}
            variant="contained"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)', 
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              minWidth: 100
            }}
          >
            Save Customer
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

export default AddNewCustomerModal;