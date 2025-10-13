import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MembersPage from './pages/MembersPage';
// We will create SchedulePage in the next step
import SchedulePage from './pages/SchedulePage'; // 1. Import the new page
import PlansPage from './pages/PlansPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<h1 className="text-2xl">Welcome to the Dashboard!</h1>} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;