import React, { useState } from 'react';
import { Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AddNewCustomerModal from '../components/CustomersScreen/AddNewCustomerModal';
import Header from '../components/Header';

const CustomersScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Sample customer data
  const [customers] = useState([
    { id: 1, name: 'OK Zimbabwe', email: 'orders@ok.co.zw', phone: '+263 242 111111', totalCredit: 1500, creditStatus: 'Good', lastPurchase: '2024-03-15' },
    { id: 2, name: 'Pick n Pay', email: 'procurement@pnp.co.za', phone: '+27 11 222 3333', totalCredit: 4500, creditStatus: 'Overdue', lastPurchase: '2024-03-10' },
    { id: 3, name: 'TM Supermarket', email: 'purchasing@tm.co.zw', phone: '+263 242 444444', totalCredit: 2500, creditStatus: 'Good', lastPurchase: '2024-03-12' },
  ]);

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
      height: '95%',
      margin: '0 10px 5px 10px',
      borderRadius: '10px',
      padding: '20px',
      position: 'relative',
      paddingTop:'50px'
    }}>
      {/* Header Section */}
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
          placeholder="Search customers..."
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

        <AddNewCustomerModal 
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="contained"
          startIcon={<AddIcon />}
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
          Add New Customer
        </Button>
      </Box>

      {/* Customers Table */}
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
              {['Customer Name', 'Contact Info', 'Total Credit', 'Credit Status', 'Last Purchase', 'Actions'].map((header) => (
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
            {customers.map((customer) => (
              <TableRow key={customer.id} sx={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                '&:last-child td': { borderBottom: 'none' },
              }}>
                <TableCell sx={{ color: '#ffffff' }}>{customer.name}</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>
                  <Box>
                    <Typography variant="body2">{customer.email}</Typography>
                    <Typography variant="body2">{customer.phone}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#ffffff' }}>${customer.totalCredit.toFixed(2)}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: '#ffffff',
                      backgroundColor: customer.creditStatus === 'Good' ? 
                        'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                    }}
                  >
                    {customer.creditStatus}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: '#ffffff' }}>{customer.lastPurchase}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined"
                      sx={{ 
                        color: '#fff', 
                        borderColor: 'rgba(255,255,255,0.3)',
                        '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outlined" 
                      sx={{ 
                        color: '#ff5252', 
                        borderColor: 'rgba(255,82,82,0.3)',
                        '&:hover': { borderColor: '#ff5252' }
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </div>
  );
};

export default CustomersScreen;