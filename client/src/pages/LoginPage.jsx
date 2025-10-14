import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            alert(response.data.msg); // On success, show an alert
            // In the next step, we will redirect the user to the dashboard
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response.data.msg); // Show error message from backend
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary-dark">
            <div className="w-full max-w-md p-8 space-y-6 bg-secondary-dark rounded-lg shadow-md border border-gray-700">
                <h1 className="text-2xl font-bold text-center text-white">Admin Login</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button type="submit" className="w-full py-2 font-semibold text-white bg-accent rounded-md hover:bg-accent-hover">
                        Login
                    </button>
                </form>
                <p className="text-sm text-center text-gray-200">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-accent hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;