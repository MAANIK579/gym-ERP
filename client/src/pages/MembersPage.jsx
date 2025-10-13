import React, { useState, useEffect } from "react";
import axios from "axios";
import AddMemberForm from "../components/AddMemberForm"; // Import the form
import Modal from "../components/Modal"; // Import Modal
import EditMemberForm from "../components/EditMemberForm"; // Import Edit Form

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/members");
        setMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // This function will be called by the form component after a new member is created
  const handleMemberAdded = (newMember) => {
    // Add the new member to the top of the list for immediate feedback
    setMembers([newMember, ...members]);
  };

  const handleDelete = async (memberId) => {
    // Show a confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await axios.delete(`http://localhost:5000/api/members/${memberId}`);
        // Update the UI by filtering out the deleted member
        setMembers(members.filter((member) => member.id !== memberId));
      } catch (error) {
        console.error("Failed to delete member:", error);
        alert("Could not delete member.");
      }
    }
  };
  const handleEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleMemberUpdated = (updatedMember) => {
    // Find the member in the list and replace it with the updated data
    setMembers(members.map(member => member.id === updatedMember.id ? updatedMember : member));
    setIsModalOpen(false); // Close the modal
    setEditingMember(null); // Clear the editing state
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading members...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Member Management
      </h1>

      {/* Render the AddMemberForm component and pass the handler function as a prop */}
      <AddMemberForm onMemberAdded={handleMemberAdded} />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          {/* ... keep the rest of the table code exactly the same ... */}
          <thead className="bg-gray-200">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {member.fullName}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {member.email}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                    ></span>
                    <span className="relative">{member.status}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button onClick={() => handleEdit(member)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Member">
        <EditMemberForm member={editingMember} onFinished={handleMemberUpdated} />
      </Modal>
    </div>
  );
};

export default MembersPage;
