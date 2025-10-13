import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '', durationDays: '' });

    // Fetch existing plans
    useEffect(() => {
        axios.get('http://localhost:5000/api/plans')
            .then(res => setPlans(res.data))
            .catch(err => console.error("Failed to fetch plans:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/plans', formData);
            setPlans([...plans, response.data]); // Add new plan to the list
            setFormData({ name: '', price: '', durationDays: '' }); // Clear form
        } catch (error) {
            alert('Failed to create plan.');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Membership Plans</h1>
            {/* Form to create a new plan */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-4">Create New Plan</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Plan Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Price (₹)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Duration (Days)</label>
                        <input type="number" name="durationDays" value={formData.durationDays} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                    <button type="submit" className="md:col-start-3 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Create Plan</button>
                </form>
            </div>

            {/* List of existing plans */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Plan Name</th>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Price</th>
                            <th className="px-5 py-3 border-b-2 text-left text-xs font-semibold uppercase">Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map(plan => (
                            <tr key={plan.id}>
                                <td className="px-5 py-5 border-b bg-white text-sm">{plan.name}</td>
                                <td className="px-5 py-5 border-b bg-white text-sm">₹{plan.price}</td>
                                <td className="px-5 py-5 border-b bg-white text-sm">{plan.durationDays} Days</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlansPage;