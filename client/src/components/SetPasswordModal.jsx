import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const SetPasswordModal = ({ isOpen, onClose, member }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        if (!password) {
            alert('Please enter a password.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/member-auth/set-password', {
                memberId: member.id,
                password: password,
            });
            alert(`Password for ${member.fullName} has been set successfully!`);
            setPassword(''); // Clear the field
            onClose(); // Close the modal
        } catch (error) {
            console.error('Failed to set password:', error);
            alert('Failed to set password.');
        }
    };

    if (!member) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Set Password for ${member.fullName}`}>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">New Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-black"
                    placeholder="Enter new password"
                />
            </div>
            <button
                onClick={handleSubmit}
                className="w-full bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-hover"
            >
                Set Password
            </button>
        </Modal>
    );
};

export default SetPasswordModal;