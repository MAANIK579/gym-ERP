import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const ProtectedRoute = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-primary-dark">
            <Navbar />

            {/* CRITICAL CHANGE: We removed 'container mx-auto' from this <main> tag.
                This allows the page content below to be full-width by default. */}
            <main className="flex-grow p-4 md:p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedRoute;