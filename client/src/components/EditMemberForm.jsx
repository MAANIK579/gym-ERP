import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditMemberForm = ({ member, onFinished }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    status: 'Active'
  });

  // When the 'member' prop changes, pre-fill the form with that member's data
  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber || '',
        status: member.status
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/members/${member.id}`, formData);
      onFinished(response.data); // Pass the updated member data back
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Failed to update member.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-gray-200 font-semibold mb-2">Full Name</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-200 font-semibold mb-2">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" required />
      </div>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-200 font-semibold mb-2">Phone Number</label>
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent" />
      </div>
       <div className="mb-4">
        <label htmlFor="status" className="block text-gray-200 font-semibold mb-2">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent">
            <option value="Active">Active</option>
            <option value="Frozen">Frozen</option>
            <option value="Expired">Expired</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-hover">
        Save Changes
      </button>
    </form>
  );
};

export default EditMemberForm;