
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AddClassForm = ({ onClassAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        trainerName: '',
        startTime: '',
        endTime: '',
        capacity: '',
        memberId: '' // New field for member assignment
    });
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(true);

    useEffect(() => {
        // Fetch members for dropdown
        axios.get('http://localhost:5000/api/members')
            .then(res => setMembers(res.data))
            .catch(() => setMembers([]))
            .finally(() => setLoadingMembers(false));
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                capacity: parseInt(formData.capacity),
                memberId: formData.memberId ? formData.memberId : null
            };
            if (!payload.memberId) delete payload.memberId;
            const response = await axios.post('http://localhost:5000/api/classes', payload);
            onClassAdded(response.data);
            setFormData({ title: '', trainerName: '', startTime: '', endTime: '', capacity: '', memberId: '' });
        } catch (error) {
            console.error('Error adding class:', error);
            alert('Failed to add class. Please check the details and try again.');
        }
    };

    return (
        <div className="bg-secondary-dark p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Schedule a New Class</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Class Title */}
                <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-gray-200 font-semibold mb-2">Class Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                {/* Trainer Name */}
                <div>
                    <label htmlFor="trainerName" className="block text-gray-200 font-semibold mb-2">Trainer Name</label>
                    <input type="text" name="trainerName" value={formData.trainerName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                {/* Capacity */}
                <div>
                    <label htmlFor="capacity" className="block text-gray-200 font-semibold mb-2">Capacity</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                {/* Start Time */}
                <div>
                    <label htmlFor="startTime" className="block text-gray-200 font-semibold mb-2">Start Time</label>
                    <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                {/* End Time */}
                <div>
                    <label htmlFor="endTime" className="block text-gray-200 font-semibold mb-2">End Time</label>
                    <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
                </div>
                {/* Assign to Member (optional) */}
                <div className="md:col-span-2">
                    <label htmlFor="memberId" className="block text-gray-200 font-semibold mb-2">Assign to Member (optional)</label>
                    <select
                        name="memberId"
                        value={formData.memberId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="">-- Group Class (All Members) --</option>
                        {loadingMembers ? (
                            <option>Loading members...</option>
                        ) : (
                            members.map(member => (
                                <option key={member.id} value={member.id}>{member.fullName} ({member.email})</option>
                            ))
                        )}
                    </select>
                </div>
                {/* Submit Button */}
                <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-hover">
                        Add Class
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddClassForm;