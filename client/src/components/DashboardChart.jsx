import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardChart = ({ title, chartData }) => {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: title,
                data: chartData.data,
                fill: false,
                backgroundColor: '#3B82F6', // Blue color
                borderColor: '#3B82F6',
                tension: 0.1,
            },
        ],
    };
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="bg-secondary-dark p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <Line data={data} options={options} />
        </div>
    );
};

export default DashboardChart;