import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';
  
ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
BarElement,
Title,
Tooltip,
Legend,
ArcElement
);
  

const InventoryBreakdown = ({ data }) => {
  const categories = Object.keys(data);
  const totals = categories.map((category) =>
    Object.values(data[category]).reduce((a, b) => a + b, 0)
  );

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: totals,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div style={{width: '45%', margin: 'auto'}}>
      <h2>Inventory Breakdown</h2>
      <Pie data={chartData}/>
    </div>
  );
};

export default InventoryBreakdown;
