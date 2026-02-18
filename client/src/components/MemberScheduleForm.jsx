import React, { useState } from 'react';
import axios from 'axios';

const MemberScheduleForm = ({ memberId, onScheduleAdded, editingSchedule, onEditComplete }) => {
    const [formData, setFormData] = useState({
        title: editingSchedule?.title || '',
        description: editingSchedule?.description || '',
        date: editingSchedule?.date ? new Date(editingSchedule.date).toISOString().split('T')[0] : '',
        startTime: editingSchedule?.startTime || '',
        endTime: editingSchedule?.endTime || '',
        type: editingSchedule?.type || 'Personal',
        isRecurring: editingSchedule?.isRecurring || false,
        recurringDays: editingSchedule?.recurringDays ? JSON.parse(editingSchedule.recurringDays) : []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRecurringDaysChange = (day) => {
        setFormData(prev => ({
            ...prev,
            recurringDays: prev.recurringDays.includes(day)
                ? prev.recurringDays.filter(d => d !== day)
                : [...prev.recurringDays, day]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
            setError('Please fill in all required fields.');
            setIsLoading(false);
            return;
        }

        if (formData.startTime >= formData.endTime) {
            setError('End time must be after start time.');
            setIsLoading(false);
            return;
        }

        try {
            const scheduleData = {
                ...formData,
                recurringDays: formData.isRecurring ? JSON.stringify(formData.recurringDays) : null
            };

            let response;
            if (editingSchedule) {
                // Update existing schedule
                response = await axios.put(`http://localhost:5000/api/schedule/${editingSchedule.id}`, scheduleData);
                onEditComplete(response.data);
            } else {
                // Create new schedule
                response = await axios.post(`http://localhost:5000/api/schedule/member/${memberId}`, scheduleData);
                onScheduleAdded(response.data);
            }

            // Reset form
            setFormData({
                title: '',
                description: '',
                date: '',
                startTime: '',
                endTime: '',
                type: 'Personal',
                isRecurring: false,
                recurringDays: []
            });
        } catch (error) {
            console.error('Error saving schedule:', error);
            setError('Failed to save schedule. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-secondary-dark p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-accent">
                {editingSchedule ? 'Edit Schedule Item' : 'Add New Schedule Item'}
            </h3>

            {error && (
                <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-primary-dark text-white rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                        placeholder="e.g., Morning Workout, Yoga Session"
                        required
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-3 bg-primary-dark text-white rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                        placeholder="Optional description..."
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-white font-medium mb-2">
                        Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-primary-dark text-white rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                        required
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="block text-white font-medium mb-2">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-primary-dark text-white rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                    >
                        <option value="Personal">Personal</option>
                        <option value="Workout">Workout</option>
                        <option value="Diet">Diet</option>
                        <option value="Cardio">Cardio</option>
                        <option value="Strength Training">Strength Training</option>
                        <option value="Rest Day">Rest Day</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Start Time */}
                <div>
                    <label className="block text-white font-medium mb-2">
                        Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-primary-dark text-white rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                        required
                    />
                </div>

                {/* End Time */}
                <div>
                    <label className="block text-white font-medium mb-2">
                        End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-primary-dark text-white rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                        required
                    />
                </div>
            </div>

            {/* Recurring Schedule */}
            <div className="mt-4">
                <label className="flex items-center text-white font-medium mb-2">
                    <input
                        type="checkbox"
                        name="isRecurring"
                        checked={formData.isRecurring}
                        onChange={handleInputChange}
                        className="mr-2"
                    />
                    Make this a recurring schedule
                </label>

                {formData.isRecurring && (
                    <div className="mt-3">
                        <p className="text-gray-300 mb-2">Select recurring days:</p>
                        <div className="flex flex-wrap gap-2">
                            {daysOfWeek.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleRecurringDaysChange(day)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        formData.recurringDays.includes(day)
                                            ? 'bg-accent text-white'
                                            : 'bg-primary-dark text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 mt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : editingSchedule ? 'Update Schedule' : 'Add to Schedule'}
                </button>

                {editingSchedule && (
                    <button
                        type="button"
                        onClick={onEditComplete}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default MemberScheduleForm;