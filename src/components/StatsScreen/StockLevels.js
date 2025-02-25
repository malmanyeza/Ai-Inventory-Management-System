import React from 'react';
import { Bar } from 'react-chartjs-2';
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

const StockLevels = ({ data }) => {
  const labels = [];
  const quantities = [];

  Object.entries(data).forEach(([category, items]) => {
    Object.entries(items).forEach(([item, quantity]) => {
      labels.push(`${item} (${category})`);
      quantities.push(quantity);
    });
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Stock Levels',
        data: quantities,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Stock Levels</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default StockLevels;
