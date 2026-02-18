import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MemberScheduleForm from '../components/MemberScheduleForm';
import MemberScheduleCalendar from '../components/MemberScheduleCalendar';
import MemberScheduleModal from '../components/MemberScheduleModal';

const MemberSchedulePage = () => {
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();


    const [member, setMember] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("member"));
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (!member) {
            navigate("/member/login");
            return;
        }
        fetchSchedules();
        // eslint-disable-next-line
    }, []);

    const fetchSchedules = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:5000/api/schedule/member/${member.id}`);
            setSchedules(response.data);
        } catch (error) {
            console.error("Failed to fetch schedules:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScheduleAdded = (newSchedule) => {
        setSchedules(prev => [...prev, newSchedule]);
        setShowForm(false);
    };

    const handleScheduleUpdated = (updatedSchedule) => {
        setSchedules(prev => 
            prev.map(schedule => 
                schedule.id === updatedSchedule.id ? updatedSchedule : schedule
            )
        );
        setEditingSchedule(null);
        setShowForm(false);
    };

    const handleScheduleDeleted = (scheduleId) => {
        setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
    };


    const handleScheduleClick = (schedule) => {
        setSelectedSchedule(schedule);
        setShowModal(true);
    };

    // Called from modal to start editing
    const handleEditSchedule = (schedule) => {
        setEditingSchedule(schedule);
        setShowForm(true);
        setShowModal(false);
        setSelectedSchedule(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("member");
        navigate("/member/login");
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary-dark text-white">
                Loading Your Schedule...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-dark text-white font-sans">
            {/* Header */}
            <header className="bg-secondary-dark w-full shadow-lg">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/member/dashboard")}
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-xl font-bold text-white">My Personal Schedule</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4 md:p-6">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold">Personal Schedule Manager</h2>
                            <p className="text-gray-400">
                                Organize your fitness routine and personal activities
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingSchedule(null);
                                setShowForm(!showForm);
                            }}
                            className="bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            {showForm ? 'Cancel' : 'Add New Schedule'}
                        </button>
                    </div>
                </div>

                {/* Schedule Form */}
                {showForm && (
                    <div className="mb-8">
                        <MemberScheduleForm
                            memberId={member.id}
                            onScheduleAdded={handleScheduleAdded}
                            editingSchedule={editingSchedule}
                            onEditComplete={handleScheduleUpdated}
                        />
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Total Schedules</h3>
                        <p className="text-2xl font-bold text-white">{schedules.length}</p>
                    </div>
                    <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">This Week</h3>
                        <p className="text-2xl font-bold text-white">
                            {schedules.filter(s => {
                                const scheduleDate = new Date(s.date);
                                const now = new Date();
                                const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                                const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
                                return scheduleDate >= weekStart && scheduleDate <= weekEnd;
                            }).length}
                        </p>
                    </div>
                    <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Workouts</h3>
                        <p className="text-2xl font-bold text-white">
                            {schedules.filter(s => 
                                s.type === 'Workout' || s.type === 'Cardio' || s.type === 'Strength Training'
                            ).length}
                        </p>
                    </div>
                    <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
                        <h3 className="text-sm font-medium text-gray-400 mb-2">Recurring</h3>
                        <p className="text-2xl font-bold text-white">
                            {schedules.filter(s => s.isRecurring).length}
                        </p>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="mb-8">
                    <MemberScheduleCalendar
                        schedules={schedules}
                        onScheduleClick={handleScheduleClick}
                        onDeleteSchedule={handleScheduleDeleted}
                    />
                </div>

                {/* Upcoming Schedules List */}
                <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-accent">Upcoming Activities</h3>
                    {schedules.filter(s => new Date(s.date) >= new Date()).length > 0 ? (
                        <div className="space-y-3">
                            {schedules
                                .filter(s => new Date(s.date) >= new Date())
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .slice(0, 10)
                                .map((schedule) => {
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

                                    return (
                                        <div
                                            key={schedule.id}
                                            onClick={() => handleScheduleClick(schedule)}
                                            className="p-4 bg-primary-dark rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full ${getTypeColor(schedule.type)}`}></div>
                                                    <div>
                                                        <h4 className="font-bold text-white">{schedule.title}</h4>
                                                        <p className="text-sm text-gray-400">
                                                            {schedule.startTime} - {schedule.endTime}
                                                            {schedule.description && ` • ${schedule.description.substring(0, 80)}${schedule.description.length > 80 ? '...' : ''}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-medium">
                                                        {new Date(schedule.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(schedule.date).toLocaleDateString('en-US', {
                                                            weekday: 'long'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400 mb-4">
                                No upcoming activities scheduled.
                            </p>
                            <button
                                onClick={() => {
                                    setEditingSchedule(null);
                                    setShowForm(true);
                                }}
                                className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Add Your First Activity
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Schedule Detail Modal */}
            <MemberScheduleModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedSchedule(null);
                }}
                schedule={selectedSchedule}
                onScheduleUpdated={handleScheduleUpdated}
                onScheduleDeleted={handleScheduleDeleted}
                onEditSchedule={handleEditSchedule}
            />
        </div>
    );
};

export default MemberSchedulePage;