import React from 'react';

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="bg-secondary-dark p-6 rounded-lg shadow-md">
            <div className="flex items-center">
                <div className="text-3xl mr-4">{icon}</div>
                <div>
                    <p className="text-gray-300 font-semibold">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;