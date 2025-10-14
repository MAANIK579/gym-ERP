import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // We'll show the Navbar only for logged-in users

const ProtectedRoute = () => {
    // Check if user data exists in local storage
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // If no user, redirect to the login page
        return <Navigate to="/login" />;
    }

    // If user is logged in, show the Navbar and the requested page
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto p-4">
                <Outlet /> {/* This will render the child route element */}
            </main>
        </div>
    );
};

export default ProtectedRoute;