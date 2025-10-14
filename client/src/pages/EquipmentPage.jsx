import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import LogMaintenanceModal from "../components/LogMaintenanceModal";

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({ name: "", purchaseDate: "" });
  // We will add state for a maintenance modal later
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    const res = await axios.get("http://localhost:5000/api/equipment");
    setEquipment(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:5000/api/equipment",
      formData
    );
    setEquipment([...equipment, res.data]);
    setFormData({ name: "", purchaseDate: "" });
  };
  const openLogModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };
  const handleMaintenanceLogged = (updatedItem) => {
    setEquipment(
      equipment.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setIsModalOpen(false);
    setSelectedItem(null);
    alert("Maintenance logged successfully!");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-blue-500">
        Equipment & Inventory
      </h1>
      {/* Add Equipment Form */}
      <div className="bg-secondary-dark p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4 text-white">Add New Equipment</h2>
        <form onSubmit={handleSubmit} className="flex items-end gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-semibold text-gray-200">
              Equipment Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div className="flex-grow">
            <label className="block text-sm font-semibold text-gray-200">Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-secondary-dark text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-hover"
          >
            Add Item
          </button>
        </form>
      </div>

      {/* Equipment List Table */}
      <div className="bg-secondary-dark shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-primary-dark">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-gray-200">Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-gray-200">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-gray-200">
                Last Maintained
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-5 border-b border-gray-700 text-white">{item.name}</td>
                <td className="px-5 py-5 border-b border-gray-700 text-white">{item.status}</td>
                <td className="px-5 py-5 border-b border-gray-700 text-white">
                  {item.lastMaintenance
                    ? moment(item.lastMaintenance).format("DD MMM YYYY")
                    : "N/A"}
                </td>
                <td className="px-5 py-5 border-b border-gray-700">
                  <button
                    onClick={() => openLogModal(item)}
                    className="text-green-400 hover:text-green-300"
                  >
                    Log Maintenance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LogMaintenanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                equipment={selectedItem}
                onMaintenanceLogged={handleMaintenanceLogged}
            />
    </div>
  );
};

export default EquipmentPage;
