import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import the calendar's CSS

// Setup the localizer by providing the moment Object
const localizer = momentLocalizer(moment);

const ClassCalendar = ({ classes, onSelectEvent }) => { 
    const formattedEvents = classes.map(cls => ({
        id: cls.id,
        title: `${cls.title} (${cls.trainerName || 'TBA'})`,
        start: new Date(cls.startTime), // Convert string date to Date object
        end: new Date(cls.endTime),
    }));

    return (
        <div style={{ height: 700 }}> {/* Give the calendar a defined height */}
            <Calendar
                localizer={localizer}
                events={formattedEvents}
                startAccessor="start"
                endAccessor="end"
                // ↓↓↓ 2. VERIFY 'onSelectEvent' IS PASSED TO THE CALENDAR HERE ↓↓↓
                onSelectEvent={onSelectEvent} 
                style={{ margin: '0' }}
            />
        </div>
    );
};

export default ClassCalendar;