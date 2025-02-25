import React from 'react';
import { Line } from 'react-chartjs-2';

const SalesTrends = () => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Cordials Sales',
        data: [500, 450, 480, 520, 530, 550],
        borderColor: '#FF6384',
        fill: false,
      },
      {
        label: 'Juices Sales',
        data: [600, 580, 590, 620, 640, 660],
        borderColor: '#36A2EB',
        fill: false,
      },
      {
        label: 'Water Sales',
        data: [300, 320, 310, 340, 350, 370],
        borderColor: '#FFCE56',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Sales Trends</h2>
      <Line data={chartData} />
    </div>
  );
};

export default SalesTrends;
