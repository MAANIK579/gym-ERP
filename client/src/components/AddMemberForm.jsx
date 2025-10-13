import React, { useState } from 'react';
import axios from 'axios';

const AddMemberForm = ({ onMemberAdded }) => {
    // State to hold the form data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: ''
    });

    // Function to update state when user types in an input field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Function to handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the page from reloading
        try {
            const response = await axios.post('http://localhost:5000/api/members', formData);
            onMemberAdded(response.data); // Pass the new member data back to the parent page
            // Clear the form fields after successful submission
            setFormData({ fullName: '', email: '', phoneNumber: '' }); 
        } catch (error) {
            console.error('Error adding member:', error);
            // You can add state here to show an error message to the user
            alert('Failed to add member. The email might already be in use.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Add New Member</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phoneNumber" className="block text-gray-700 font-semibold mb-2">Phone Number (Optional)</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                    Add Member
                </button>
            </form>
        </div>
    );
};

export default AddMemberForm;