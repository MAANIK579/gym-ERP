import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const BookingModal = ({ isOpen, onClose, selectedClass, onBookingConfirmed }) => {
    const [members, setMembers] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState('');

    // Fetch all members to populate the dropdown
    useEffect(() => {
        if (isOpen) {
            axios.get('http://localhost:5000/api/members')
                .then(response => {
                    setMembers(response.data);
                    // Select the first member by default if list is not empty
                    if (response.data.length > 0) {
                        setSelectedMemberId(response.data[0].id);
                    }
                })
                .catch(error => console.error("Failed to fetch members:", error));
        }
    }, [isOpen]); // Re-run this effect when the modal is opened

    const handleBooking = async () => {
        if (!selectedMemberId) {
            alert('Please select a member.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/bookings', {
                classId: selectedClass.id,
                memberId: selectedMemberId,
            });
            onBookingConfirmed(); // Notify parent component of success
        } catch (error) {
            console.error('Booking failed:', error);
            // Display the specific error from the backend (e.g., "Class is full")
            alert(`Booking failed: ${error.response?.data?.error || 'Server error'}`);
        }
    };

    if (!selectedClass) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Book Class: ${selectedClass.title}`}>
            <div className="mb-4 text-gray-200">
                <p><strong>Trainer:</strong> {selectedClass.trainerName || 'N/A'}</p>
                <p><strong>Time:</strong> {moment(selectedClass.start).format('lll')} - {moment(selectedClass.end).format('LT')}</p>
            </div>
            <div className="mb-4">
                <label htmlFor="member" className="block text-gray-200 font-semibold mb-2">Select Member to Book</label>
                <select
                    id="member"
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
                    {members.map(member => (
                        <option key={member.id} value={member.id}>{member.fullName}</option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleBooking}
                className="w-full bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-hover"
            >
                Confirm Booking
            </button>
        </Modal>
    );
};

export default BookingModal;