import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/statcard';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/reports/dashboard')
            .then(res => setStats(res.data))
            .catch(err => console.error("Failed to fetch stats:", err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <p>Loading dashboard...</p>;
    }

    if (!stats) {
        return <p>Could not load dashboard data.</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Active Members" 
                    value={stats.totalActiveMembers} 
                    icon="👥" 
                />
                <StatCard 
                    title="Revenue This Month" 
                    value={`₹${stats.monthlyRevenue.toLocaleString('en-IN')}`} 
                    icon="💰" 
                />
                <StatCard 
                    title="New Members This Month" 
                    value={stats.newMembersThisMonth} 
                    icon="🎉" 
                />
                <StatCard 
                    title="Pending Invoices" 
                    value={stats.pendingInvoices} 
                    icon="🧾" 
                />
            </div>
            {/* We can add charts and other reports here later */}
        </div>
    );
};

export default DashboardPage;