import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar, Typography, Box, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const SideDrawer = ({ drawerWidth }) => {
  // Initialize with AI Assistant selected (index 0)
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const menuItems = [
    { text: 'AI Assistant', path: '/', icon: <SmartToyOutlinedIcon /> },
    { text: 'Stats', path: '/stats', icon: <BarChartOutlinedIcon /> },
    { text: 'Inventory', path: '/inventory', icon: <Inventory2OutlinedIcon /> },
    { text: 'Customers', path: '/customers', icon: <GroupOutlinedIcon /> },
    { text: 'Place Order', path: '/place-order', icon: <ShoppingCartOutlinedIcon /> },
  ];

  // Keep the rest of your handleItemClick and other functions the same
  const handleItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer component remains the same */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            margin: '10px',
            height: '97%',
            paddingLeft: '10px',
            paddingRight: '10px',
            WebkitBackdropFilter: 'blur(10px)',
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => handleItemClick(index)}
              sx={{
                color: '#ffffff',
                borderRadius: '10px',
                margin: '5px 0',
                paddingLeft: '20px',
                paddingRight: '20px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                },
                ...(selectedIndex === index && {
                  border: '2px solid rgba(255, 255, 255, 0.67)',
                  borderRadius: '10px',
                }),
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff', minWidth: '50px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'normal',
                      padding: '2px 10px',
                      borderRadius: '10px',
                      color: '#ffffff',
                    }}
                  >
                    {item.text}
                  </Typography>
                }
                sx={{ textAlign: 'left', ml: -2 }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      
    </Box>
  );
};

export default SideDrawer;