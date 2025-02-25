import React from 'react';
import InventoryBreakdown from '../components/StatsScreen/InventoryBreakdown';
import StockLevels from '../components/StatsScreen/StockLevels';
import SalesTrends from '../components/StatsScreen/SalesTrends';
import Header from '../components/Header';

const dummyData = { /* ... your dummy data ... */ };

const StatsScreen = () => {
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
    <div 
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          height: '95%',
          margin: '0 10px 5px 10px',
          borderRadius: '10px',
          padding: '20px',
          position: 'relative',
          display:'flex',
          flexDirection: 'column',
          paddingTop:'50px'
      }}
    >
      <h1 style={{ 
        color: 'white', 
        margin: '0 0 20px 0',
        fontSize: '1.8rem',
        flexShrink: 0 // Prevent title from shrinking
      }}>
        Inventory Stats
      </h1>

      <div 
        style={{
          flex: 1,
          width: '90%',
          margin: '0 auto',
          overflowY: 'auto',
          paddingRight: '10px',
          height: 'calc(100% - 40px)', // Account for title height
          maxHeight: '65vh', // Add maximum height constraint
          boxSizing: 'border-box',
        }}
        className="components-container"
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '25px',
          minHeight: '90%', // Ensure content fills available space
          paddingBottom: '20px',
          boxSizing: 'border-box',
        }}>
          <InventoryBreakdown data={dummyData} />
          <StockLevels data={dummyData} />
          <SalesTrends />
        </div>
      </div>

      {/* Scrollbar styles */}
      <style>
        {`
          .components-container::-webkit-scrollbar {
            width: 8px;
          }
          .components-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .components-container::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.5);
            border-radius: 10px;
            border: 2px solid rgba(255, 255, 255, 0.3);
          }
          .components-container::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.7);
          }
        `}
      </style>
    </div>
    </div>
  );
};

export default StatsScreen;