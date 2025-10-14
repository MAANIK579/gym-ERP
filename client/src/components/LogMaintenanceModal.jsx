import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const LogMaintenanceModal = ({ isOpen, onClose, equipment, onMaintenanceLogged }) => {
    const [notes, setNotes] = useState('');

    const handleSubmit = async () => {
        if (!notes) {
            alert('Please enter maintenance notes.');
            return;
        }
        try {
            const response = await axios.post(
                `http://localhost:5000/api/equipment/${equipment.id}/logs`,
                { notes }
            );
            onMaintenanceLogged(response.data); // Pass the updated equipment back
            setNotes(''); // Clear the textarea
        } catch (error) {
            console.error('Failed to log maintenance:', error);
            alert('Failed to log maintenance.');
        }
    };

    if (!equipment) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Log Maintenance for ${equipment.name}`}>
            <div className="mb-4">
                <label htmlFor="notes" className="block text-gray-200 font-semibold mb-2">
                    Notes (e.g., "Cleaned and lubricated the belt.")
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>
            <button
                onClick={handleSubmit}
                className="w-full bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-hover"
            >
                Save Log
            </button>
        </Modal>
    );
};

export default LogMaintenanceModal;