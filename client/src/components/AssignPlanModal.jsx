import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const AssignPlanModal = ({ isOpen, onClose, member, onPlanAssigned }) => {
    const [plans, setPlans] = useState([]);
    const [selectedPlanId, setSelectedPlanId] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Fetch all available plans when the modal opens
            axios.get('http://localhost:5000/api/plans')
                .then(res => {
                    setPlans(res.data);
                    if (res.data.length > 0) {
                        setSelectedPlanId(res.data[0].id); // Default to the first plan
                    }
                })
                .catch(err => console.error("Failed to fetch plans:", err));
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!selectedPlanId) {
            alert('Please select a plan.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/invoices/assign', {
                memberId: member.id,
                planId: selectedPlanId
            });
            onPlanAssigned();
        } catch (error) {
            alert('Failed to assign plan.');
        }
    };

    if (!member) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Assign Plan to ${member.fullName}`}>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Select Membership Plan</label>
                <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                >
                    {plans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                            {plan.name} (₹{plan.price} for {plan.durationDays} days)
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                Assign Plan & Generate Invoice
            </button>
        </Modal>
    );
};

export default AssignPlanModal;