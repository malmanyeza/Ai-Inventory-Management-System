// InventoryTable.jsx
import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const InventoryTable = ({ inventory }) => {
  return (
    <TableContainer
      component={Box}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {['Stock ID', 'Name', 'Quantity', 'Category', 'Price', 'Percentage Sold'].map((header) => (
              <TableCell
                key={header}
                sx={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
                  py: 2,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {inventory.map((item) => (
            <TableRow
              key={item.id}
              sx={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                '&:last-child td': { borderBottom: 'none' },
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
              }}
            >
              {Object.entries(item).map(([key, value]) => (
                <TableCell
                  key={key}
                  sx={{
                    color: '#ffffff',
                    textAlign: 'center',
                    py: 1.5,
                    borderColor: 'rgba(255,255,255,0.1)'
                  }}
                >
                  {key === 'price' ? `$${value.toFixed(2)}` : value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;