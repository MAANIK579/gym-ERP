import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddClassForm from '../components/AddClassForm';
import ClassCalendar from '../components/ClassCalendar';
import BookingModal from '../components/BookingModal';

const SchedulePage = () => {
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/classes');
                setClasses(response.data);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClasses();
    }, []);

    // --- THIS IS THE MISSING FUNCTION ---
    const handleClassAdded = (newClass) => {
        setClasses(prevClasses => [...prevClasses, newClass]);
    };

    const handleSelectClass = (event) => {
        const originalClass = classes.find(c => c.id === event.id);
        setSelectedClass(originalClass);
        setIsBookingModalOpen(true);
    };

    const handleBookingConfirmed = () => {
        alert('Booking successful!');
        setIsBookingModalOpen(false);
        setSelectedClass(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Class Schedule</h1>
            {/* Now this line will work correctly */}
            <AddClassForm onClassAdded={handleClassAdded} />
            
            <div className="bg-white p-4 rounded-lg shadow-md mt-6">
                 {isLoading ? ( <p>Loading calendar...</p> ) : (
                    <ClassCalendar classes={classes} onSelectEvent={handleSelectClass} />
                )}
            </div>
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                selectedClass={selectedClass}
                onBookingConfirmed={handleBookingConfirmed}
            />
        </div>
    );
};

export default SchedulePage;