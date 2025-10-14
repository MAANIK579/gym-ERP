import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MembersPage from './pages/MembersPage';
import SchedulePage from './pages/SchedulePage'; // 1. Import the new page
import PlansPage from './pages/PlansPage';
import InvoicesPage from './pages/InvoicesPage'; // 1. IMPORT
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;