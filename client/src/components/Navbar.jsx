import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Gym ERP</Link>
                <div className="space-x-6">
                    <Link to="/members" className="hover:text-gray-300">Members</Link>
                    <Link to="/schedule" className="hover:text-gray-300">Schedule</Link>
                    <Link to="/plans" className="hover:text-gray-300">Plans</Link>
                    <Link to="/invoices" className="hover:text-gray-300">Invoices</Link>
                    {/* We will add more links here later */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;