import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);
    
    const userInitial = user?.email ? user.email[0].toUpperCase() : '?';

    // Define styles for NavLink to avoid repetition
    const navLinkClasses = ({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive
                ? 'bg-accent text-white' // Active link style
                : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Inactive link style
        }`;

    return (
        // The main nav bar is now full-width
        <nav className="bg-secondary-dark w-full shadow-lg">
            {/* The container centers the content inside the full-width bar */}
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/" className="text-2xl font-bold text-white hover:text-accent transition-colors duration-200">
                    Gym ERP
                </Link>
                
                {/* Main Navigation Links using NavLink */}
                <div className="hidden md:flex items-center space-x-4">
                    <NavLink to="/members" className={navLinkClasses}>Members</NavLink>
                    <NavLink to="/schedule" className={navLinkClasses}>Schedule</NavLink>
                    <NavLink to="/plans" className={navLinkClasses}>Plans</NavLink>
                    <NavLink to="/invoices" className={navLinkClasses}>Invoices</NavLink>
                    <NavLink to="/equipment" className={navLinkClasses}>Equipment</NavLink>
                </div>
                
                {/* Profile Dropdown Section */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                        className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-dark focus:ring-white transition-transform duration-200 hover:scale-110"
                    >
                        {userInitial}
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-secondary-dark ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-4 py-3 text-sm text-gray-300">
                                <p className="font-semibold text-white">Signed in as</p>
                                <p className="truncate">{user?.email}</p>
                            </div>
                            <div className="border-t border-gray-700"></div>
                            <NavLink to="/profile" onClick={() => setIsDropdownOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                                Settings
                            </NavLink>
                            <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;