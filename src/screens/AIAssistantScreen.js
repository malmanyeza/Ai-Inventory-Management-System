import React, { useState, useEffect } from 'react';
import MessageInput from '../components/AIAssistantScreen/MessageInput';
import Chats from '../components/AIAssistantScreen/Chats';
import '../index.css';
import Header from '../components/Header';
import { useOrders } from '../context/OrdersContext';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { use } from 'react';



const AIAssistantScreen = () => {
  const { 
    createInvoiceWithAssistant, 
    assistantMessages, 
    isAssistantProcessing,
    setAssistantMessages
  } = useOrders();
  
  const [localMessages, setLocalMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);  // Typing indicator state
  const [firstMessageSent, setFirstMessageSent] = useState(false)

  // Sync context messages with local state for display
  useEffect(() => {
    const formattedMessages = assistantMessages.map(msg => ({
      sender: msg.role === 'user' ? 'user' : 'ai',
      text: msg.content[0].text.value
    }));
    setLocalMessages(formattedMessages);
  }, [assistantMessages]);

  useEffect(()=>{
    localMessages.length>0?setFirstMessageSent(true):null
  },[localMessages])

  const handleSendMessage = async (message) => {
    // Add user message to local state immediately
    setLocalMessages(prev => [...prev, { sender: 'user', text: message }]);
    
    try {
      setIsTyping(true); // Show typing indicator

      // Simulate delay for a more realistic typing effect
      setTimeout(async () => {
        if (message.toLowerCase().startsWith('yes')) {
          await createInvoiceWithAssistant(message);
        } else if (message.toLowerCase().startsWith('no')) {
          setAssistantMessages(prev => [...prev, { role: 'assistant', content: "Please provide the correct customer or product name." }]);
        } else {
          await createInvoiceWithAssistant(message);
        }
        setIsTyping(false); // Hide typing indicator after response
      }, 1500);
      
    } catch (error) {
      setIsTyping(false);
      // Show error message if something goes wrong
      setLocalMessages(prev => [
        ...prev,
        { 
          sender: 'ai', 
          text: `Sorry, I encountered an error: ${error.message}. Please try again.`
        }
      ]);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div
        className="main-content"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          height: '95%',
          margin: '0 10px 5px 10px',
          borderRadius: '10px',
          padding: '20px',
          position: 'relative',
          paddingTop:'50px'
        }}
      >
        {/* Header and Description */}
        {localMessages.length < 1 && (
          <Box
            sx={{
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              maxWidth: '600px',
              margin: '0 auto 20px auto',
              
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              📊 AI Stock Manager
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              How can I assist you today? You can:
            </Typography>

            <List sx={{ mt: 2, textAlign: 'left', display: 'inline-block' }}>
              {[
                { text: 'Create new invoices', icon: <ReceiptIcon /> },
                { text: 'Check stock levels', icon: <InventoryIcon /> },
                { text: 'Query order status', icon: <QueryStatsIcon /> },
                { text: 'Generate sales reports', icon: <AssessmentIcon /> },
              ].map((item, index) => (
                <ListItem key={index} sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon sx={{ color: '#ffcc00' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {firstMessageSent && (
        
        <div
          style={{
            marginLeft: '40px',
            width: '90%',
            maxHeight: '450px',
            overflowY: 'auto',
            alignSelf: 'center',
          }}
          className="custom-scrollbar"
        >
          <Chats messages={localMessages} isLoading={isTyping} /> {/* Pass isTyping */}
        </div>
        )}
        <div
          style={{
            marginTop: '20px',
            position: 'fixed',
            bottom: firstMessageSent? '20px':'50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
          }}
        >
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isProcessing={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default AIAssistantScreen;
