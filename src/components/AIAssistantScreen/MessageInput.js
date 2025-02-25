import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage(''); // Clear the input field after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Match the chats box theme
        backdropFilter: 'blur(10px)', // Add blur effect
        borderRadius: '20px', // Rounded corners for consistency
        padding: '10px 10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Subtle shadow
        maxWidth: '700px',
        width: '100%',
        margin: '0 auto', // Center the component
        color: '#fff', // White text color to match the chats theme
      }}
    >
      <TextField
        placeholder="Type your message here..."
        variant="standard"
        fullWidth
        multiline
        minRows={1}
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          disableUnderline: true,
          sx: {
            padding: '10px',
            fontSize: '16px',
            color: '#fff', // White text for consistency
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light translucent background
            borderRadius: '10px', // Rounded input box
          },
        }}
      />
      <IconButton
        onClick={handleSendMessage}
        sx={{
          position: 'absolute',
          right: '10px',
          bottom: '10px',
          color: '#007bff', // Button matches theme color
          '&:hover': {
            color: '#0056b3', // Slightly darker on hover
          },
        }}
      >
        <SendOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
