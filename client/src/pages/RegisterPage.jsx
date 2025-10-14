import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', { email, password });
            alert('Registration successful! Please log in.');
            navigate('/login'); // Redirect to login page after success
        } catch (err) {
            setError(err.response.data.msg || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary-dark">
            <div className="w-full max-w-md p-8 space-y-6 bg-secondary-dark rounded-lg shadow-md border border-gray-700">
                <h1 className="text-2xl font-bold text-center text-white">Register New Staff</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-200">Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full py-2 font-semibold text-white bg-accent rounded-md hover:bg-accent-hover">
                        Register
                    </button>
                </form>
                <p className="text-sm text-center text-gray-200">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-accent hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;