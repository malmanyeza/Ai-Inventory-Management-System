import React, { useState } from 'react';
import { Box, Typography, Menu, MenuItem, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRole, setUserRole] = useState('guest');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = (role) => {
    setUserRole(role);
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 5px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        position: 'fixed', // Changed from sticky to fixed
        top: 11,
        left: 285,
        right: 0,
        zIndex: 1100, // Increased z-index
        width: '77%',
        paddingTop:3,
        paddingBottom:2,
        borderRadius: '10px',
      }}
    >
      {/* Logo */}
      <Typography
        variant="h6"
        sx={{
          color: '#fff',
          fontWeight: 'bold',
          letterSpacing: '1px',
        }}
      >
        StockMaster AI
      </Typography>

      {/* User Role Selector */}
      <Box
        component="button"
        onClick={handleMenuOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '8px',
          padding: '8px 16px',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: 'rgba(255, 255, 255, 0.5)'
          }
        }}
      >
        <Typography variant="body1">
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </Typography>
        {anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginTop: '8px',
          }
        }}
      >
        <MenuItem
          onClick={() => handleRoleChange('guest')}
          sx={{
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Guest
        </MenuItem>
        <MenuItem
          onClick={() => handleRoleChange('admin')}
          sx={{
            color: '#fff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Admin
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;