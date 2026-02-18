import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MembersPage from "./pages/MembersPage";
import SchedulePage from "./pages/SchedulePage"; // 1. Import the new page
import PlansPage from "./pages/PlansPage";
import InvoicesPage from "./pages/InvoicesPage"; // 1. IMPORT
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import EquipmentPage from "./pages/EquipmentPage";
import ProfilePage from "./pages/ProfilePage";
import MemberLoginPage from "./pages/MemberLoginPage";
import MemberDashboard from "./pages/MemberDashboard";
import MemberSchedulePage from "./pages/MemberSchedulePage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 w-screen h-screen">
        <main className="w-full h-full p-0 m-0">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            {/* --- Public Member Portal --- */}
            <Route path="/member/login" element={<MemberLoginPage />} />
            {/* We would also need a protected route for members */}
            <Route path="/member/dashboard" element={<MemberDashboard />} />
            <Route path="/member/schedule" element={<MemberSchedulePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
