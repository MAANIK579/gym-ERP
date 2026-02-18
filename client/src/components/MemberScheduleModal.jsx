import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';


const MemberScheduleModal = ({ isOpen, onClose, schedule, onScheduleUpdated, onScheduleDeleted, onEditSchedule }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen || !schedule) return null;

    const getTypeColor = (type) => {
        const colors = {
            'Personal': 'bg-blue-500',
            'Workout': 'bg-green-500',
            'Diet': 'bg-orange-500',
            'Cardio': 'bg-red-500',
            'Strength Training': 'bg-purple-500',
            'Rest Day': 'bg-gray-500',
            'Other': 'bg-yellow-500'
        };
        return colors[type] || 'bg-gray-500';
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this schedule item?')) {
            return;
        }

        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:5000/api/schedule/${schedule.id}`);
            onScheduleDeleted(schedule.id);
            onClose();
        } catch (error) {
            console.error('Error deleting schedule:', error);
            alert('Failed to delete schedule. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const recurringDays = schedule.isRecurring && schedule.recurringDays 
        ? JSON.parse(schedule.recurringDays) 
        : [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-secondary-dark rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-600">
                    <h2 className="text-xl font-bold text-white">Schedule Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    {/* Schedule Type Badge */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(schedule.type)}`}>
                            {schedule.type}
                        </span>
                        {schedule.isRecurring && (
                            <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-sm font-medium">
                                Recurring
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-4">{schedule.title}</h3>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Date</h4>
                            <p className="text-white">{moment(schedule.date).format('dddd, MMMM Do, YYYY')}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Time</h4>
                            <p className="text-white">{schedule.startTime} - {schedule.endTime}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {schedule.description && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                            <div className="bg-primary-dark p-4 rounded-lg">
                                <p className="text-white whitespace-pre-wrap">{schedule.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Recurring Days */}
                    {schedule.isRecurring && recurringDays.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Recurring Days</h4>
                            <div className="flex flex-wrap gap-2">
                                {recurringDays.map(day => (
                                    <span key={day} className="px-3 py-1 bg-accent text-white rounded-full text-sm">
                                        {day}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Schedule Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div>
                            <span className="font-medium">Created:</span> {moment(schedule.createdAt).format('MMM D, YYYY')}
                        </div>
                        <div>
                            <span className="font-medium">Last Updated:</span> {moment(schedule.updatedAt).format('MMM D, YYYY')}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-600">
                    <button
                        onClick={() => onEditSchedule(schedule)}
                        className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Edit Schedule
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemberScheduleModal;