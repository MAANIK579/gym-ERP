import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";

// --- Reusable SVG Icon Component ---
const Icon = ({ path, className = "w-6 h-6 text-accent" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
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
  const [greeting, setGreeting] = useState("");
  const [showActivationAlert, setShowActivationAlert] = useState(false);
  const [activatedPlan, setActivatedPlan] = useState(null);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [assignedClasses, setAssignedClasses] = useState([]);
  const navigate = useNavigate();

  const member = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("member"));
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    // Set Greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    if (!member) {
      navigate("/member/login");
      return;
    }

    const fetchAll = async () => {
      try {
        // Profile
        const profileRes = await axios.get(`http://localhost:5000/api/my-profile/${member.id}`);
        setProfileData(profileRes.data);

        // Upcoming Schedules
        try {
          const upRes = await axios.get(`http://localhost:5000/api/schedule/member/${member.id}/upcoming`);
          setUpcomingSchedules(upRes.data);
        } catch (error) {
          setUpcomingSchedules([]);
        }

        // Assigned Classes
        try {
          const acRes = await axios.get(`http://localhost:5000/api/schedule/member/${member.id}`);
          const now = new Date();
          setAssignedClasses(acRes.data.filter(s => s.type === 'Class' && new Date(s.date) >= now));
        } catch (error) {
          setAssignedClasses([]);
        }

        // Activation Alert
        const recentlyPaidInvoice = profileRes.data.invoices.find((invoice) => {
          const isPaid = invoice.status === "Paid";
          const paidRecently = moment().diff(moment(invoice.dueDate), "minutes") < 5;
          return isPaid && paidRecently;
        });
        if (recentlyPaidInvoice && profileRes.data.memberDetails.plan) {
          setActivatedPlan(profileRes.data.memberDetails.plan);
          setShowActivationAlert(true);
          setTimeout(() => setShowActivationAlert(false), 10000);
        }
      } catch (error) {
        setProfileData(null);
        setUpcomingSchedules([]);
        setAssignedClasses([]);
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [member, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("member");
    navigate("/member/login");
  };

  const closeActivationAlert = () => {
    setShowActivationAlert(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-dark text-white">
        Loading Your Fitness Hub...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-dark text-white">
        Could not load your profile. Please try again.
      </div>
    );
  }

  const { memberDetails, invoices, kpis } = profileData;
  const latestWorkout = memberDetails?.workoutPlans?.[0];
  const latestDiet = memberDetails?.dietPlans?.[0];

  const totalDuration = memberDetails?.plan?.durationDays || 1;
  const daysLeft = kpis?.daysRemaining > 0 ? kpis.daysRemaining : 0;
  const progressPercentage = (daysLeft / totalDuration) * 100;

  return (
    <div className="min-h-screen bg-primary-dark text-white font-sans">
      {/* Membership Activation Success Alert */}
      {showActivationAlert && activatedPlan && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-slide-down">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-2xl border-2 border-green-400">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full p-2">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    🎉 Membership Activated Successfully!
                  </h3>
                  <p className="text-green-50 mb-2">
                    Your <span className="font-bold">{activatedPlan.name}</span>{" "}
                    membership is now active!
                  </p>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 mt-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-green-100">Duration:</p>
                        <p className="font-bold">
                          {activatedPlan.durationDays} days
                        </p>
                      </div>
                      <div>
                        <p className="text-green-100">Valid Until:</p>
                        <p className="font-bold">
                          {kpis?.planExpiryDate
                            ? moment(kpis.planExpiryDate).format("DD MMM YYYY")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-green-50 text-sm mt-3">
                    Welcome aboard! Start your fitness journey today. 💪
                  </p>
                </div>
              </div>
              <button
                onClick={closeActivationAlert}
                className="text-white hover:text-green-100 transition-colors ml-4"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-secondary-dark w-full shadow-lg">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-white">Fitness Hub</h1>
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
        <div className="mb-8">
          <h2 className="text-4xl font-bold">
            {greeting}, {memberDetails?.fullName?.split(" ")[0]}!
          </h2>
          <p className="text-gray-400">
            Here's your activity summary for today.
          </p>
        </div>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Membership Plan"
            value={memberDetails?.plan?.name || "N/A"}
            icon={
              <Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l-3 3m3 0l-3-3m-3.75 6.75h16.5c.621 0 1.125-.504 1.125-1.125V6.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v10.5c0 .621.504 1.125 1.125 1.125z" />
            }
          />
          <StatCard
            title="Days Remaining"
            value={kpis?.daysRemaining > 0 ? kpis.daysRemaining : "Expired"}
            subtext={
              kpis?.planExpiryDate
                ? `Expires on ${moment(kpis.planExpiryDate).format(
                  "DD MMM YYYY"
                )}`
                : ""
            }
            icon={
              <Icon path="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />
            }
          />
          <StatCard
            title="Upcoming Classes"
            value={memberDetails?.bookings?.length || 0}
            subtext="This week"
            icon={<Icon path="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />}
          />
          <StatCard
            title="Pending Invoices"
            value={kpis?.pendingInvoicesCount || 0}
            subtext={`Total Spent: ₹${(
              kpis?.totalAmountPaid || 0
            ).toLocaleString("en-IN")}`}
            icon={
              <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            }
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Membership Progress */}
            <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-accent">
                Membership Progress
              </h3>
              <div className="w-full bg-primary-dark rounded-full h-4">
                <div
                  className="bg-accent h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-right text-sm mt-2 text-gray-400">
                {daysLeft} of {totalDuration} days remaining
              </p>
            </div>


            {/* Gym Class Schedule */}
            <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-accent">
                Gym Class Schedule
              </h3>
              {((memberDetails?.bookings?.length || 0) + assignedClasses.length) > 0 ? (
                <ul className="space-y-4">
                  {/* Booked group classes */}
                  {(memberDetails.bookings || []).map((booking) => (
                    <li
                      key={"booking-" + booking.id}
                      className="p-4 bg-primary-dark rounded-md flex items-center justify-between transition-all hover:bg-gray-800"
                    >
                      <div>
                        <p className="font-bold text-lg text-white">
                          {booking.class.title}
                        </p>
                        <p className="text-sm text-gray-400">
                          with {booking.class.trainerName || "TBA"} -{" "}
                          {moment(booking.class.startTime).format("h:mm a")}
                        </p>
                      </div>
                      <span className="text-base font-semibold text-gray-300">
                        {moment(booking.class.startTime).format("dddd, MMM DD")}
                      </span>
                    </li>
                  ))}
                  {/* Assigned personal classes */}
                  {assignedClasses.map((cls) => (
                    <li
                      key={"assigned-" + cls.id}
                      className="p-4 bg-primary-dark rounded-md flex items-center justify-between border-l-4 border-accent transition-all hover:bg-gray-800"
                    >
                      <div>
                        <p className="font-bold text-lg text-white">
                          {cls.title} <span className="ml-2 text-xs bg-accent text-white px-2 py-1 rounded">Personal</span>
                        </p>
                        <p className="text-sm text-gray-400">
                          {cls.description}
                          {cls.startTime && ` - ${cls.startTime}`}
                        </p>
                      </div>
                      <span className="text-base font-semibold text-gray-300">
                        {moment(cls.date).format("dddd, MMM DD")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">
                  You have no upcoming classes booked or assigned. Time to get active!
                </p>
              )}
            </div>

            {/* Personal Schedule */}
            <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-accent">
                  My Personal Schedule
                </h3>
                <button
                  onClick={() => navigate('/member/schedule')}
                  className="text-sm bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Manage Schedule
                </button>
              </div>
              {upcomingSchedules.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingSchedules.slice(0, 5).map((schedule) => {
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
                      <li
                        key={schedule.id}
                        className="p-4 bg-primary-dark rounded-md transition-all hover:bg-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getTypeColor(schedule.type)}`}></div>
                            <div>
                              <p className="font-bold text-white">{schedule.title}</p>
                              <p className="text-sm text-gray-400">
                                {schedule.startTime} - {schedule.endTime}
                                {schedule.description && ` • ${schedule.description.substring(0, 50)}${schedule.description.length > 50 ? '...' : ''}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-300">
                              {moment(schedule.date).format("MMM DD")}
                            </span>
                            <p className="text-xs text-gray-400">
                              {moment(schedule.date).format("dddd")}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">
                    You haven't created any personal schedules yet.
                  </p>
                  <button
                    onClick={() => navigate('/member/schedule')}
                    className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Create Your First Schedule
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Plans & History */}
          <div className="space-y-8">
            {/* Recent Payments */}
            <div className="bg-secondary-dark p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-accent">
                Recent Payments
              </h3>
              <ul className="space-y-3">
                {(invoices || []).slice(0, 3).map((invoice) => (
                  <li
                    key={invoice.id}
                    className="p-3 bg-primary-dark rounded-md flex justify-between items-center"
                  >
                    <p className="font-semibold text-sm">
                      Invoice #{invoice.id} - ₹{invoice.amount}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${invoice.status === "Paid"
                        ? "bg-green-200 text-green-900"
                        : "bg-yellow-200 text-yellow-900"
                        }`}
                    >
                      {invoice.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <style>{`
                @keyframes slide-down {
                    from {
                        transform: translate(-50%, -100%);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-50%, 0);
                        opacity: 1;
                    }
                }
                .animate-slide-down {
                    animation: slide-down 0.5s ease-out;
                }
            `}</style>
    </div>
  );
};

export default MemberDashboard;
