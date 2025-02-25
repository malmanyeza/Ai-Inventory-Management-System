// InventoryScreen.jsx
import React, { useState } from 'react';
import InventoryTable from '../components/InventoryScreen/InventoryTable';
import { Box } from '@mui/material';
import InventoryTableHeader from '../components/InventoryScreen/InventoryTableHeader';
import Header from '../components/Header';

const InventoryScreen = () => {
  const [inventory, setInventory] = useState([
    { id: '001', name: 'Product A', quantity: 120, category: 'Electronics', price: 500, percentageSold: '75%' },
    { id: '002', name: 'Product B', quantity: 50, category: 'Apparel', price: 30, percentageSold: '60%' },
    { id: '003', name: 'Product C', quantity: 200, category: 'Home & Kitchen', price: 150, percentageSold: '90%' },
  ]);

  const handleAddProduct = () => {/* existing logic */};
  const handleExportPdf = () => {/* existing logic */};
  const handleApplyFilter = (filter) => {/* existing logic */};

  return (
    <div
      style={
        {
          height:'100%',
          display: 'flex', flexDirection: 'column'
        }
      }
    >
      <Header/>
    <Box sx={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      height: '90%',
      margin: '0 10px 5px 10px',
      borderRadius: '10px',
      padding: '20px',
      position: 'relative',
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      }}>
        <InventoryTableHeader
          onAddProduct={handleAddProduct}
          onExportPdf={handleExportPdf}
          onApplyFilter={handleApplyFilter}
        />
        
        <Box sx={{
          flex: 1,
          width: '100%',
          mt: '10px',
          overflowY: 'auto',
          pr: '10px',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '10px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }
        }}>
          <InventoryTable inventory={inventory} />
        </Box>
      </Box>
    </Box>
  </div>
  );
};

export default InventoryScreen;