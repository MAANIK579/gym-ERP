import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import LogMaintenanceModal from "../components/LogMaintenanceModal";

const EquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({ name: "", purchaseDate: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    const res = await axios.get("http://localhost:5000/api/equipment");
    setEquipment(res.data);
    // Auto-select first item if none selected
    if (res.data.length > 0 && !selectedItem) {
      setSelectedItem(res.data[0]);
    }
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
    setSelectedItem(updatedItem); // Update selected item with new logs
    setIsModalOpen(false);
    alert("Maintenance logged successfully!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Operational":
        return "text-green-400";
      case "Under Maintenance":
        return "text-yellow-400";
      case "Out of Order":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Side - Equipment List (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-blue-500">
          Equipment & Inventory
        </h1>

        {/* Add Equipment Form */}
        <div className="bg-secondary-dark p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Add New Equipment
          </h2>
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
              <label className="block text-sm font-semibold text-gray-200">
                Purchase Date
              </label>
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
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-gray-200">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-gray-200">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-gray-200">
                  Last Maintained
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-gray-200">
                  Logs
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`cursor-pointer hover:bg-gray-800 transition-colors ${
                    selectedItem?.id === item.id ? "bg-gray-800" : ""
                  }`}
                >
                  <td className="px-5 py-5 border-b border-gray-700 text-white">
                    {item.name}
                  </td>
                  <td
                    className={`px-5 py-5 border-b border-gray-700 font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-700 text-white">
                    {item.lastMaintenance
                      ? moment(item.lastMaintenance).format("DD MMM YYYY")
                      : "N/A"}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-700 text-gray-400">
                    {item.maintenanceLogs?.length || 0} records
                  </td>
                  <td className="px-5 py-5 border-b border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLogModal(item);
                      }}
                      className="text-green-400 hover:text-green-300 font-semibold"
                    >
                      Log Maintenance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Side - Maintenance History (1/3 width) */}
      <div className="lg:col-span-1">
        <div className="bg-secondary-dark p-6 rounded-lg shadow-md sticky top-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              Maintenance History
            </h2>
            {selectedItem && (
              <button
                onClick={() => openLogModal(selectedItem)}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                + Log
              </button>
            )}
          </div>

          {!selectedItem ? (
            <div className="text-center py-12 text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p>Select equipment to view history</p>
            </div>
          ) : (
            <div>
              {/* Selected Equipment Info */}
              <div className="mb-4 p-4 bg-primary-dark rounded-lg border border-gray-700">
                <h3 className="font-semibold text-lg text-white mb-2">
                  {selectedItem.name}
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Status:</span>{" "}
                    <span className={getStatusColor(selectedItem.status)}>
                      {selectedItem.status}
                    </span>
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Purchase Date:</span>{" "}
                    {selectedItem.purchaseDate
                      ? moment(selectedItem.purchaseDate).format("DD MMM YYYY")
                      : "N/A"}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Total Logs:</span>{" "}
                    {selectedItem.maintenanceLogs?.length || 0}
                  </p>
                </div>
              </div>

              {/* Maintenance Logs */}
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {selectedItem.maintenanceLogs?.length === 0 ? (
                  <p className="text-gray-400 text-center py-8 text-sm">
                    No maintenance logs yet
                  </p>
                ) : (
                  selectedItem.maintenanceLogs?.map((log, index) => (
                    <div
                      key={log.id}
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {selectedItem.maintenanceLogs.length - index}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm mb-2 break-words">
                            {log.notes}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              {moment(log.performedOn).format(
                                "DD MMM YYYY, hh:mm A"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
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