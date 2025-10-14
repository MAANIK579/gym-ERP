import React, { useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:5000/api/auth/change-password', {
                userId: user.id,
                currentPassword,
                newPassword,
            });
            setMessage(response.data.msg);
            // Clear fields on success
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response.data.msg);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-blue-500">Profile</h1>
            <div className="bg-secondary-dark p-6 rounded-lg shadow-md max-w-lg">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white">Account Email</h2>
                    <p className="text-gray-200">{user?.email}</p>
                </div>
                <hr className="my-6 border-gray-700" />
                <h2 className="text-xl font-semibold mb-4 text-white">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-700 rounded-md bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-700 rounded-md bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
                    <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-700 rounded-md bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
                    {message && <p className="text-green-400">{message}</p>}
                    {error && <p className="text-red-400">{error}</p>}
                    <button type="submit" className="w-full py-2 font-semibold text-white bg-accent rounded-md hover:bg-accent-hover">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;