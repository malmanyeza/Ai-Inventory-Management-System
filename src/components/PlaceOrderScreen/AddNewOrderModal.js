import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useOrders } from '../../context/OrdersContext';
import { useCustomers } from '../../context/CustomersContext';
import { useInventory } from '../../context/InventoryContext';



const AddNewOrderModal = ({ open, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to current date
  const [items, setItems] = useState([{ id: 1, productId: "", quantity: 1 }]);
  const [newCustomerData] = useState({
    tradeName: '',
    registeredName: '',
    vatNumber: '',
    tinNumber: '',
    email: '',
    phone: '',
    address: ''
  });
  const [totals, setTotals] = useState({
    subtotalExcl: 0,
    vatTotal: 0,
    invoiceTotal: 0,
  });
  

  const { addOrder, generateInvoicePDF } = useOrders();
  const {customers, companyDetails} = useCustomers();
  const {inventory} = useInventory();

  const products = inventory;
  
  const VAT_RATE = 0.1304;

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value); 
  };

const allowedFields = ["productId", "name", "pricePerCase", "unitPrice", "vatAmount", "totalExcl", "totalIncl", "quantity"]; // Fields in the database

const handleChange = (index, field, value) => {
  const updatedItems = [...items];
  updatedItems[index][field] = value;

  // If the changed field affects pricing (like productId or quantity), update calculated fields:
  if (field === "productId" || field === "quantity") { 
    const product = getProductDetails(value); // Fetch product details

    if (product.id) {
      updatedItems[index].name = product.name; // Set product name
      updatedItems[index].pricePerCase = product.pricePerCase; // Set product price
    }

    updatedItems[index].quantity = parseInt(updatedItems[index].quantity) || 1;

    // Recalculate pricing fields
    const { unitPrice, vatAmount, totalExcl, totalIncl } = calculateValues(updatedItems[index]);
    updatedItems[index].unitPrice = unitPrice;
    updatedItems[index].vatAmount = vatAmount;
    updatedItems[index].totalExcl = totalExcl;
    updatedItems[index].totalIncl = totalIncl;
  }

  // Filter out any extra properties before updating state
  const cleanedItems = updatedItems.map(item =>
    Object.fromEntries(Object.entries(item).filter(([key]) => allowedFields.includes(key)))
  );

  setItems(cleanedItems);
};
  
  const getProductDetails = (productId) => products.find(p => p.id === productId) || {};
  
  const calculateValues = (item) => {
    const product = getProductDetails(item.productId);
    if (!product.id) return { unitPrice: 0, vatAmount: 0, totalExcl: 0, totalIncl: 0 };

    const unitPrice = parseFloat((product.pricePerCase / (1 + VAT_RATE)).toFixed(2));
    const totalExcl = parseFloat((unitPrice * item.quantity).toFixed(2));
    const vatAmount = parseFloat((totalExcl * VAT_RATE).toFixed(2));
    const totalIncl = parseFloat((totalExcl + vatAmount).toFixed(2));

    return { unitPrice, vatAmount, totalExcl, totalIncl };
};
  
useEffect(() => {
  const subtotalExcl = items.reduce((sum, item) => sum + (parseFloat(item.totalExcl) || 0), 0).toFixed(2);
  const vatTotal = items.reduce((sum, item) => sum + (parseFloat(item.vatAmount) || 0), 0).toFixed(2);
  const invoiceTotal = items.reduce((sum, item) => sum + (parseFloat(item.totalIncl) || 0), 0).toFixed(2);

  setTotals({ 
      subtotalExcl: parseFloat(subtotalExcl), 
      vatTotal: parseFloat(vatTotal), 
      invoiceTotal: parseFloat(invoiceTotal) 
  });
}, [items]);
  
  


  const handleAddItem = useCallback(() => {
    setItems(prev => [...prev, { id: Date.now(), quantity: 1, product: '', price: 0, vat: 16 }]);
  }, []);

  

  // Your handleSubmit function
const handleSubmit = async () => {
  const orderInfo = {
    date: selectedDate,
    companyDetails, // your company info (static)
    customer: selectedCustomer || newCustomerData, // full customer details
    items, // array of items
    subtotalExcl: totals.subtotalExcl, // calculated subtotal (excl. VAT)
    vatTotal: totals.vatTotal, // calculated VAT total
    invoiceTotal: totals.invoiceTotal, // calculated invoice total
    // any additional fields
  };

  try {
    // Add order to database and get back the order ID
    const orderId = await addOrder(orderInfo);
    // Optionally, add the orderId to your orderInfo for the invoice
    const orderDataWithId = { ...orderInfo, orderId };

    // Generate PDF invoice
    generateInvoicePDF(orderDataWithId);

    // Close the modal upon successful order submission
    onClose();
  } catch (error) {
    // Handle submission error (e.g., display a message)
    console.error("Order submission failed", error);
  }
};

  
  // Calculate totals
  const subtotalExcl = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const vatTotal = items.reduce((sum, item) => sum + (item.quantity * item.price * item.vat/100), 0);
  const invoiceTotal = subtotalExcl + vatTotal;

  // Styled dropdown props for consistent look
  const dropdownProps = useMemo(() => ({
    sx: {
      color: '#fff',
      '& .MuiSelect-select': { minHeight: '42px' },
      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
    },
    MenuProps: {
      PaperProps: {
        sx: {
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          '& .MuiMenuItem-root': {
            color: '#fff',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }
        }
      }
    }
  }), []);

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
        width: 800,
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
          mb: 2,
          p: 3,
          backgroundColor: 'rgba(255,255,255,0.05)',
          flexShrink: 0
        }}>
          <Typography variant="h6" sx={{ color: '#fff' }}>Create New Order</Typography>
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
          {/* Section 1: Company Details */}
          <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#fff' }}>Company Details</Typography>
              <Button 
                size="small" 
                onClick={() => setEditMode(!editMode)}
                sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                {editMode ? 'Save' : 'Edit'}
              </Button>
            </Box>
            
            <TextField
              type="date"
              label="Order Date"
              value={selectedDate}
              onChange={handleDateChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ 
                mb: 2,
                '& .MuiInputBase-input': { color: '#fff' },
                '& .MuiInputLabel-root': { color: '#fff' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
              }}
            />
            
            {Object.entries(companyDetails).map(([key, value]) => (
              editMode ? (
                <TextField
                  key={key}
                  label={key}
                  defaultValue={value}
                  fullWidth
                  sx={{ 
                    mb: 1, 
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#fff' }
                  }}
                />
              ) : (
                <Typography 
                  key={key} 
                  variant="body2" 
                  sx={{ 
                    color: '#fff', 
                    mb: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {`${key}: ${value}`}
                </Typography>
              )
            ))}
          </Box>

          {/* Section 2: Customer Details */}
          <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="subtitle1" sx={{ color: '#fff', mb: 2 }}>Customer Details</Typography>
            
            {!isNewCustomer ? (
              <>
                <Select
                  value={selectedCustomer ? selectedCustomer.id : ""}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    const cust = customers.find(customer => customer.id === id);
                    setSelectedCustomer(cust);
                  }}
                  fullWidth
                  displayEmpty
                  {...dropdownProps}
                >
                  <MenuItem value="">Select Customer</MenuItem>
                  {customers.map(customer => (
                    <MenuItem key={customer.id} value={customer.id} sx={{ color: '#fff' }}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
                <Button 
                  onClick={() => setIsNewCustomer(true)}
                  sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  Add New Customer
                </Button>
              </>
            ) : (
              <>
                {Object.entries(newCustomerData).map(([key, value]) => (
                  <TextField
                    key={key}
                    label={key}
                    value={value}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      newCustomerData[name] = value;
                    }}
                    fullWidth
                    sx={{ 
                      mb: 2, 
                      '& .MuiInputBase-input': { color: '#fff' },
                      '& .MuiInputLabel-root': { color: '#fff' }
                    }}
                  />
                ))}

                <Button 
                  onClick={() => setIsNewCustomer(false)}
                  sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>

          {/* Section 3: Order Items */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ color: '#fff', mb: 2 }}>Order Items</Typography>
            
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <TableRow>
                    {["Quantity", "Product", "Unit Price", "VAT %", "Total (excl)", "Total (incl)"].map(header => (
                      <TableCell key={header} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => {
                    const { unitPrice, vatAmount, totalExcl, totalIncl } = calculateValues(item);
                    const product = getProductDetails(item.productId);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleChange(index, "quantity", Number(e.target.value))}
                            sx={{ width: 70, '& .MuiInputBase-input': { color: '#fff' } }}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.productId}
                            onChange={(e) => handleChange(index, "productId", Number(e.target.value))}
                            sx={{ color: '#fff' }}
                          >
                            <MenuItem value=""><em>Select Product</em></MenuItem>
                            {products.map((product) => (
                              <MenuItem key={product.id} value={product.id}>
                                {`${product.name} ${product.volume} x ${product.unitsPerCase}`}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell sx={{ color: '#fff' }}>${unitPrice.toFixed(2)}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>${vatAmount.toFixed(2)}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>${totalExcl.toFixed(2)}</TableCell>
                        <TableCell sx={{ color: '#fff' }}>${totalIncl.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                  
                </TableBody>
              </Table>
            </TableContainer>

            <Button 
              onClick={handleAddItem}
              startIcon={<AddIcon />} 
              sx={{ 
                color: '#fff', 
                mt: 2,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Add Item
            </Button>

            {/* Totals */}
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                Subtotal (excl): ${totals.subtotalExcl.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                VAT Total: ${totals.vatTotal.toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                Invoice Total: ${totals.invoiceTotal.toFixed(2)}
              </Typography>
            </Box>
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
            onClick={handleSubmit}
            variant="contained"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.1)', 
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              minWidth: 100
            }}
          >
            Save Order
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddNewOrderModal;