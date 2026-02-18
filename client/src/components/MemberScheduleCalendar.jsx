import React, { useState } from 'react';
import moment from 'moment';

const MemberScheduleCalendar = ({ schedules, onScheduleClick, onDeleteSchedule }) => {
    const [currentMonth, setCurrentMonth] = useState(moment());

    // Get the type color for different schedule types
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

    // Generate calendar days
    const generateCalendar = () => {
        const startDate = currentMonth.clone().startOf('month').startOf('week');
        const endDate = currentMonth.clone().endOf('month').endOf('week');
        const calendar = [];
        const current = startDate.clone();

        while (current.isSameOrBefore(endDate, 'day')) {
            calendar.push(current.clone());
            current.add(1, 'day');
        }

        return calendar;
    };

    // Get schedules for a specific date
    const getSchedulesForDate = (date) => {
        return schedules.filter(schedule => 
            moment(schedule.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
        );
    };

    // Navigate months
    const previousMonth = () => {
        setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
    };

    const nextMonth = () => {
        setCurrentMonth(prev => prev.clone().add(1, 'month'));
    };

    const goToToday = () => {
        setCurrentMonth(moment());
    };

    const calendar = generateCalendar();
    const today = moment();

    return (
        <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-accent">
                    {currentMonth.format('MMMM YYYY')}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={previousMonth}
                        className="p-2 bg-primary-dark text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        ‹
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 bg-primary-dark text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center font-medium text-gray-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {calendar.map((date, index) => {
                    const daySchedules = getSchedulesForDate(date);
                    const isCurrentMonth = date.month() === currentMonth.month();
                    const isToday = date.isSame(today, 'day');
                    const isPast = date.isBefore(today, 'day');

                    return (
                        <div
                            key={index}
                            className={`min-h-[120px] p-2 border rounded-lg transition-colors ${
                                isCurrentMonth 
                                    ? 'bg-primary-dark border-gray-600' 
                                    : 'bg-gray-800 border-gray-700 opacity-50'
                            } ${
                                isToday ? 'ring-2 ring-accent' : ''
                            }`}
                        >
                            {/* Date Number */}
                            <div className={`text-sm font-medium mb-1 ${
                                isToday ? 'text-accent' : 
                                isPast ? 'text-gray-500' : 'text-white'
                            }`}>
                                {date.date()}
                            </div>

                            {/* Schedule Items */}
                            <div className="space-y-1">
                                {daySchedules.slice(0, 3).map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${getTypeColor(schedule.type)} text-white`}
                                        onClick={() => onScheduleClick(schedule)}
                                        title={`${schedule.title} (${schedule.startTime} - ${schedule.endTime})`}
                                    >
                                        <div className="font-medium truncate">
                                            {schedule.title}
                                        </div>
                                        <div className="text-xs opacity-90">
                                            {schedule.startTime}
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Show more indicator */}
                                {daySchedules.length > 3 && (
                                    <div className="text-xs text-gray-400 text-center">
                                        +{daySchedules.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Schedule Types:</h4>
                <div className="flex flex-wrap gap-3">
                    {[
                        'Personal', 'Workout', 'Diet', 'Cardio', 
                        'Strength Training', 'Rest Day', 'Other'
                    ].map(type => (
                        <div key={type} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${getTypeColor(type)}`}></div>
                            <span className="text-xs text-gray-300">{type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MemberScheduleCalendar;