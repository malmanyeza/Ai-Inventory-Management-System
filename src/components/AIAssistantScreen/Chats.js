import React, { useEffect, useRef } from 'react';
import { Box, Typography, Avatar } from '@mui/material';

const Chats = ({ messages, isLoading }) => {
  const chatEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        height: '450px',
        overflowY: 'auto',
        borderRadius: '10px',
        paddingBottom: '30px',
        alignSelf: 'center',
        paddingTop: '40px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
      }}
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            width: '100%',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              backgroundColor: message.sender === 'user' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              color: '#fff',
              borderRadius: '15px',
              padding: '10px 15px',
              maxWidth: '70%',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              textAlign: 'left',
              position: 'relative',
              marginBottom: '20px',
            }}
          >
            {/* AI Avatar */}
            {message.sender === 'ai' && (
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: '0.75rem',
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  position: 'absolute',
                  top: '-12px',
                  left: '-12px',
                }}
              >
                AI
              </Avatar>
            )}

            <Typography variant="body1">{message.text}</Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'right',
                fontSize: '0.75rem',
                opacity: 0.7,
                marginTop: '5px',
              }}
            >
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        </Box>
      ))}

      {/* Typing Animation */}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#bbb',
            fontStyle: 'italic',
            padding: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '15px',
            width: 'fit-content',
            maxWidth: '70%',
          }}
        >
          <Avatar
            sx={{
              width: 24,
              height: 24,
              fontSize: '0.75rem',
              backgroundColor: '#1976d2',
              color: '#fff',
            }}
          >
            AI
          </Avatar>
          <Box sx={{ 
            display: 'flex', 
            gap: '5px',
            width: '100px'
            }}>
            <Box
              sx={{
                width: '15px',
                height: '15px',
                backgroundColor: '#bbb',
                borderRadius: '50%',
                animation: 'blink 1.5s infinite ease-in-out',
                animationDelay: '0s',
              }}
            />
            <Box
              sx={{
                width: '15px',
                height: '15px',
                backgroundColor: '#bbb',
                borderRadius: '50%',
                animation: 'blink 1.5s infinite ease-in-out',
                animationDelay: '0.2s',
              }}
            />
            <Box
              sx={{
                width: '15px',
                height: '15px',
                backgroundColor: '#bbb',
                borderRadius: '50%',
                animation: 'blink 1.5s infinite ease-in-out',
                animationDelay: '0.4s',
              }}
            />
          </Box>
        </Box>
      )}

      {/* Dummy div to ensure auto-scroll to bottom */}
      <div ref={chatEndRef}></div>

      {/* Keyframes for animation */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
          }
        `}
      </style>
    </Box>
  );
};

export default Chats;
