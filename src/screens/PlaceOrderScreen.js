import React, { useState } from 'react';
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddNewOrderModal from '../components/PlaceOrderScreen/AddNewOrderModal';
import Header from '../components/Header';

const PlaceOrderScreen = () => {
  // Sample order data

  const [modalOpen, setModalOpen] = useState(false);
  const orders = [
    { date: '2024-02-15', customer: 'John Doe', status: 'Paid', amount: 1500 },
    { date: '2024-02-14', customer: 'Jane Smith', status: 'Pending', amount: 2450 },
    { date: '2024-02-13', customer: 'Mike Johnson', status: 'Partially Paid', amount: 3200 },
    { date: '2024-02-12', customer: 'Sarah Williams', status: 'Paid', amount: 1750 },
  ];

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
      {/* Header Section */}

       {/* Add the modal component */}
       <AddNewOrderModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
      />
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
      }}>
        <TextField
          variant="outlined"
          placeholder="Search orders..."
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#ffffff', mr: 1 }} />,
            sx: {
              color: '#ffffff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
            }
          }}
          sx={{ width: '60%' }}
        />
        
        <Button
          variant="contained"
          onClick={() => setModalOpen(true)}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
            borderRadius: '8px',
            padding: '10px 20px',
            textTransform: 'none',
          }}
        >
          Place New Order
        </Button>
      </Box>

      {/* Orders Table */}
      <TableContainer sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        maxHeight: '70vh',
        overflowY: 'auto',
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
        },
      }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Date', 'Customer Name', 'Payment Status', 'Amount'].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index} sx={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                '&:last-child td': { borderBottom: 'none' },
              }}>
                <TableCell sx={{ color: '#ffffff' }}>{order.date}</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>{order.customer}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: '#ffffff',
                      backgroundColor: 
                        order.status === 'Paid' ? 'rgba(76, 175, 80, 0.2)' :
                        order.status === 'Pending' ? 'rgba(255, 152, 0, 0.2)' :
                        'rgba(244, 67, 54, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  >
                    {order.status}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: '#ffffff' }}>${order.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </div>
  );
};

export default PlaceOrderScreen;