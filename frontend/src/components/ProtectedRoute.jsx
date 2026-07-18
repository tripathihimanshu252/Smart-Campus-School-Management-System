// Author: Himanshu Tripathi
// Department: AI and DS

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const normalizeRole = (role) => {
  const safeRole = `${role || ''}`.toLowerCase().trim();
  if (!safeRole) return '';
  
  // Standardized Grouping
  if (['superadmin', 'super_admin', 'super-admin'].includes(safeRole)) return 'super-admin';
  if (['teacher', 'faculty'].includes(safeRole)) return 'teacher';
  
  // Director/Principal/HOD ko 'executive' group mein rakha hai
  if (['director', 'principal', 'hod'].includes(safeRole)) return 'executive'; 
  
  return safeRole;
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated) || !!localStorage.getItem('userToken');
  const rawRole = useSelector((state) => state.auth?.user?.role) || localStorage.getItem('userRole');
  
  const normalizedRole = normalizeRole(rawRole);
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

  const existingToken = localStorage.getItem('userToken');

  // 1. Auth Check: Agar login nahi hai, toh seedha Login page par
  if (!isAuthenticated || !existingToken) {
    localStorage.clear(); // Security: Expired session clear karo
    return <Navigate to="/" replace />;
  }

  // 2. Role Authorization Check
  // Logic: User ka role allowed list mein hona chahiye
  const isRoleAllowed = normalizedAllowedRoles.includes(normalizedRole);

  if (!isRoleAllowed) {
    console.warn(`[SECURITY] Access Denied: Role '${normalizedRole}' attempted to access route.`);
    return <Navigate to="/" replace />;
  }

  // 3. Authorization Success
  return children;
};

export default ProtectedRoute;