import React, { useState } from 'react';
import axios from 'axios';

const AddClassForm = ({ onClassAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        trainerName: '',
        startTime: '',
        endTime: '',
        capacity: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/classes', {
                ...formData,
                capacity: parseInt(formData.capacity) // Ensure capacity is a number
            });
            onClassAdded(response.data); // Notify parent component
            // Reset form
            setFormData({ title: '', trainerName: '', startTime: '', endTime: '', capacity: '' });
        } catch (error) {
            console.error('Error adding class:', error);
            alert('Failed to add class. Please check the details and try again.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Schedule a New Class</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Class Title */}
                <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Class Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                {/* Trainer Name */}
                <div>
                    <label htmlFor="trainerName" className="block text-gray-700 font-semibold mb-2">Trainer Name</label>
                    <input type="text" name="trainerName" value={formData.trainerName} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                {/* Capacity */}
                <div>
                    <label htmlFor="capacity" className="block text-gray-700 font-semibold mb-2">Capacity</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                {/* Start Time */}
                <div>
                    <label htmlFor="startTime" className="block text-gray-700 font-semibold mb-2">Start Time</label>
                    <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                {/* End Time */}
                <div>
                    <label htmlFor="endTime" className="block text-gray-700 font-semibold mb-2">End Time</label>
                    <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                {/* Submit Button */}
                <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                        Add Class
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddClassForm;