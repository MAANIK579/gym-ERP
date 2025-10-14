import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import StatCard from '../components/StatCard';
import DashboardChart from '../components/DashboardChart'; // Import Chart

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/reports/dashboard')
            .then(res => setStats(res.data))
            .catch(err => console.error("Failed to fetch stats:", err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <p>Loading dashboard...</p>;
    if (!stats) return <p>Could not load dashboard data.</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-blue-500">Dashboard</h1>
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link to="/members">
                    <StatCard title="Active Members" value={stats.kpis.totalActiveMembers} icon="👥" />
                </Link>
                <StatCard title="Revenue This Month" value={`₹${stats.kpis.monthlyRevenue.toLocaleString('en-IN')}`} icon="💰" />
                <StatCard title="New Members This Month" value={stats.kpis.newMembersThisMonth} icon="🎉" />
                <Link to="/invoices">
                    <StatCard title="Pending Invoices" value={stats.kpis.pendingInvoices} icon="🧾" />
                </Link>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardChart title="Monthly Revenue (Last 6 Months)" chartData={stats.charts.revenue} />
                <DashboardChart title="New Members (Last 6 Months)" chartData={stats.charts.newMembers} />
            </div>
        </div>
    );
};

export default DashboardPage;