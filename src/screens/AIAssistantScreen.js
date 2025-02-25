import React, { useState, useEffect } from 'react';
import MessageInput from '../components/AIAssistantScreen/MessageInput';
import Chats from '../components/AIAssistantScreen/Chats';
import '../index.css';
import Header from '../components/Header';
import { useOrders } from '../context/OrdersContext';

const AIAssistantScreen = () => {
  const { 
    createInvoiceWithAssistant, 
    assistantMessages, 
    isAssistantProcessing,
    setAssistantMessages
  } = useOrders();
  
  const [localMessages, setLocalMessages] = useState([]);

  // Sync context messages with local state for display
  useEffect(() => {
    const formattedMessages = assistantMessages.map(msg => ({
      sender: msg.role === 'user' ? 'user' : 'ai',
      text: msg.content[0].text.value
    }));
    setLocalMessages(formattedMessages);
  }, [assistantMessages]);

  const handleSendMessage = async (message) => {
    // Add user message to local state immediately
    setLocalMessages(prev => [...prev, { sender: 'user', text: message }]);
    
    try {
      // Send to AI assistant
      if (message.toLowerCase().startsWith('yes')) {
        // User confirmed the match, proceed with the invoice
        await createInvoiceWithAssistant(message);
      } else if (message.toLowerCase().startsWith('no')) {
        // User rejected the match, ask for clarification
        setAssistantMessages(prev => [...prev, { role: 'assistant', content: "Please provide the correct customer or product name." }]);
      } else {
        // Process the message normally
        await createInvoiceWithAssistant(message);
      }
      
    } catch (error) {
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
          height: '90%',
          margin: '0 10px 5px 10px',
          borderRadius: '10px',
          padding: '20px',
          position: 'relative',
        }}
      >
        {/* Header and Description */}
        {localMessages.length < 1 && (
          <div>
            <h1>AI Stock Manager</h1>
            <p>How can I help you today? You can:</p>
            <ul>
              <li>Create new invoices</li>
              <li>Check stock levels</li>
              <li>Query order status</li>
              <li>Generate sales reports</li>
            </ul>
          </div>
        )}

        {/* Chats Component */}
        <div
          style={{
            marginLeft: '40px',
            width: '90%',
            maxHeight: '400px',
            overflowY: 'auto',
            alignSelf: 'center',
          }}
          className="custom-scrollbar"
        >
          <Chats messages={localMessages} isLoading={isAssistantProcessing} />
        </div>

        {/* Message Input */}
        <div
          style={{
            marginTop: '20px',
            position: 'fixed',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
          }}
        >
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isProcessing={isAssistantProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default AIAssistantScreen;