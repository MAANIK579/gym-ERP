import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MemberLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/member-auth/login', { email, password });
            localStorage.setItem('member', JSON.stringify(response.data.member));
            navigate('/member/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Please try again.');
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2000')" }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <div className="relative w-full max-w-md p-8 space-y-8 bg-secondary-dark rounded-xl shadow-2xl z-10">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white">Member Portal</h1>
                    <p className="mt-2 text-gray-300">Welcome back to your fitness journey!</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 mt-1 bg-primary-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 mt-1 bg-primary-dark border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center font-semibold">{error}</p>}
                    <button type="submit" className="w-full py-3 font-bold text-lg text-white bg-accent rounded-lg hover:bg-accent-hover transition-transform duration-200 hover:scale-105">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MemberLoginPage;