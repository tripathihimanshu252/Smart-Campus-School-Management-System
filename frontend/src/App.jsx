// Author: Himanshu Tripathi
// Department: AI and DS

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🔥 ASLI FIX: Views ab seedha ./views/ se aayenge
import Login from './views/Login.jsx';
import DashboardLayout from './features/layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// =========================================================================
// 🚀 CORE VIEWS 
// =========================================================================
import SuperAdminDashboard from './views/SuperAdminDashboard.jsx';
import DirectorDashboard from './views/DirectorDashboard.jsx';
import PrincipalDashboard from './views/PrincipalDashboard.jsx';     
import AccountantDashboard from './views/AccountantDashboard.jsx';   
import FacultyDashboard from './views/FacultyDashboard.jsx';         
import ReceptionistDashboard from './views/ReceptionistDashboard.jsx'; 
import DriverDashboard from './views/DriverDashboard.jsx'; 

// =========================================================================
// 🚧 PLACEHOLDER DASHBOARDS
// =========================================================================
const HodDashboard = () => <div className="p-10 bg-white rounded-xl shadow-sm border border-slate-200"><h2>HOD Dashboard Active</h2><p className="text-slate-500 mt-2">Department Hub and Subject Allocation.</p></div>;
const StudentDashboard = () => <div className="p-10 bg-white rounded-xl shadow-sm border border-slate-200"><h2>Student Portal Active</h2><p className="text-slate-500 mt-2">Academic records and fee status.</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. UNIVERSAL LOGIN PORTAL */}
        <Route path="/" element={<Login />} />

        {/* 2. MASTER LAYOUT WRAPPER (Sidebar Fixed Rahega) */}
        <Route element={<DashboardLayout />}>
          
          {/* Super Admin Workspace */}
          <Route path="/superadmin/*" element={
            <ProtectedRoute allowedRoles={['super-admin', 'superadmin', 'super']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />

          {/* Director Workspace */}
          <Route path="/director/*" element={
            <ProtectedRoute allowedRoles={['director', 'executive']}>
              <DirectorDashboard />
            </ProtectedRoute>
          } />

          {/* Principal Workspace */}
          <Route path="/principal/*" element={
            <ProtectedRoute allowedRoles={['principal']}>
              <PrincipalDashboard />
            </ProtectedRoute>
          } />

          {/* HOD Workspace */}
          <Route path="/hod/*" element={
            <ProtectedRoute allowedRoles={['hod']}>
              <HodDashboard />
            </ProtectedRoute>
          } />

          {/* Accountant Workspace */}
          <Route path="/accountant/*" element={
            <ProtectedRoute allowedRoles={['accountant']}>
              <AccountantDashboard />
            </ProtectedRoute>
          } />

          {/* Receptionist Workspace */}
          <Route path="/receptionist/*" element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          } />

          {/* Faculty Workspace */}
          <Route path="/faculty/*" element={
            <ProtectedRoute allowedRoles={['faculty', 'teacher']}>
              <FacultyDashboard />
            </ProtectedRoute>
          } />

          {/* Student/Parent Workspace */}
          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['student', 'parent']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          {/* 🔥 DRIVER / TRANSPORT WORKSPACE 🔥 */}
          <Route path="/driver/*" element={
            <ProtectedRoute allowedRoles={['driver', 'transport']}>
              <DriverDashboard />
            </ProtectedRoute>
          } />

        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;