import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                // Your backend is running on port 5000
                const response = await axios.get('http://localhost:5000/api/members');
                setMembers(response.data);
            } catch (error) {
                console.error("Error fetching members:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) {
        return <p>Loading members...</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-white">Gym Members</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-secondary-dark border border-gray-700">
                    <thead className="bg-primary-dark">
                        <tr>
                            <th className="py-2 px-4 border border-gray-700 text-gray-200">Full Name</th>
                            <th className="py-2 px-4 border border-gray-700 text-gray-200">Email</th>
                            <th className="py-2 px-4 border border-gray-700 text-gray-200">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id} className="text-center">
                                <td className="py-2 px-4 border border-gray-700 text-white">{member.fullName}</td>
                                <td className="py-2 px-4 border border-gray-700 text-white">{member.email}</td>
                                <td className="py-2 px-4 border border-gray-700">
                                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
                                        {member.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MemberList;