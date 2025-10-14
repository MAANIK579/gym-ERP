import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// --- Reusable SVG Icon Component ---
const Icon = ({ path, className = "w-6 h-6 text-accent" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, icon, subtext }) => (
    <div className="bg-secondary-dark p-6 rounded-xl shadow-lg flex items-center space-x-4 transform hover:-translate-y-1 transition-transform duration-300">
        <div className="bg-primary-dark p-3 rounded-lg">{icon}</div>
        <div>
            <p className="text-sm text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
    </div>
);

const MemberDashboard = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [greeting, setGreeting] = useState('');
    const navigate = useNavigate();

    const member = JSON.parse(localStorage.getItem('member'));

    useEffect(() => {
        // Set Greeting based on time of day
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
        
        if (!member) {
            navigate('/member/login');
            return;
        }
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/my-profile/${member.id}`);
                setProfileData(response.data);
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfileData();
    }, [member, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('member');
        navigate('/member/login');
    };

    // --- PRIMARY FIX: Main guard clause to prevent rendering with incomplete data ---
    // This is the most important part. It stops the component from going further until data is ready.
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-primary-dark text-white">Loading Your Fitness Hub...</div>;
    }

    if (!profileData) {
        return <div className="flex items-center justify-center min-h-screen bg-primary-dark text-white">Could not load your profile. Please try again.</div>;
    }

    // --- Destructure data only AFTER we know it exists ---
    const { memberDetails, invoices, kpis } = profileData;
    const latestWorkout = memberDetails?.workoutPlans?.[0];
    const latestDiet = memberDetails?.dietPlans?.[0];

    // --- SECONDARY FIX: Safe calculations with fallbacks ---
    const totalDuration = memberDetails?.plan?.durationDays || 1;
    const daysLeft = kpis?.daysRemaining > 0 ? kpis.daysRemaining : 0;
    const progressPercentage = (daysLeft / totalDuration) * 100;

    return (
        <div className="min-h-screen bg-primary-dark text-white font-sans">
            {/* Header */}
            <header className="bg-secondary-dark w-full shadow-lg">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <h1 className="text-xl font-bold text-white">Fitness Hub</h1>
                    <button onClick={handleLogout} className="font-semibold text-gray-300 hover:text-white transition-colors">Logout</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4 md:p-6">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold">{greeting}, {memberDetails?.fullName?.split(' ')[0]}!</h2>
                    <p className="text-gray-400">Here's your activity summary for today.</p>
                </div>

                {/* Key Metrics Section with safe data access */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Membership Plan" value={memberDetails?.plan?.name || 'N/A'} icon={<Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 3m3 0l-3-3m-3.75 6.75h16.5c.621 0 1.125-.504 1.125-1.125V6.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v10.5c0 .621.504 1.125 1.125 1.125z" />} />
                    <StatCard title="Days Remaining" value={kpis?.daysRemaining > 0 ? kpis.daysRemaining : 'Expired'} subtext={kpis?.planExpiryDate ? `Expires on ${moment(kpis.planExpiryDate).format('DD MMM YYYY')}` : ''} icon={<Icon path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />} />
                    <StatCard title="Upcoming Classes" value={memberDetails?.bookings?.length || 0} subtext="This week" icon={<Icon path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />} />
                    <StatCard title="Pending Invoices" value={kpis?.pendingInvoicesCount || 0} subtext={`Total Spent: ₹${(kpis?.totalAmountPaid || 0).toLocaleString('en-IN')}`} icon={<Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />} />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Membership Progress */}
                        <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-accent">Membership Progress</h3>
                            <div className="w-full bg-primary-dark rounded-full h-4">
                                <div className="bg-accent h-4 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                            <p className="text-right text-sm mt-2 text-gray-400">{daysLeft} of {totalDuration} days remaining</p>
                        </div>
                        
                        {/* Upcoming Classes */}
                        <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-accent">This Week's Schedule</h3>
                            {(memberDetails?.bookings || []).length > 0 ? (
                                <ul className="space-y-4">
                                    {memberDetails.bookings.map(booking => (
                                        <li key={booking.id} className="p-4 bg-primary-dark rounded-md flex items-center justify-between transition-all hover:bg-gray-800">
                                            <div>
                                                <p className="font-bold text-lg text-white">{booking.class.title}</p>
                                                <p className="text-sm text-gray-400">with {booking.class.trainerName || 'TBA'} - {moment(booking.class.startTime).format('h:mm a')}</p>
                                            </div>
                                            <span className="text-base font-semibold text-gray-300">{moment(booking.class.startTime).format('dddd, MMM DD')}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">You have no upcoming classes booked. Time to get active!</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Plans & History */}
                    <div className="space-y-8">
                        {/* Workout & Diet Plans */}
                        <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-accent">My Plans</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-white">Workout Plan</h4>
                                    <p className="text-sm text-gray-400 p-3 bg-primary-dark rounded mt-1 whitespace-pre-wrap">{latestWorkout?.details || 'No workout plan assigned yet.'}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Diet Plan</h4>
                                    <p className="text-sm text-gray-400 p-3 bg-primary-dark rounded mt-1 whitespace-pre-wrap">{latestDiet?.details || 'No diet plan assigned yet.'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Payments */}
                        <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-accent">Recent Payments</h3>
                             <ul className="space-y-3">
                                {(invoices || []).slice(0, 3).map(invoice => (
                                    <li key={invoice.id} className="p-3 bg-primary-dark rounded-md flex justify-between items-center">
                                        <p className="font-semibold text-sm">Invoice #{invoice.id} - ₹{invoice.amount}</p>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${invoice.status === 'Paid' ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'}`}>{invoice.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MemberDashboard;