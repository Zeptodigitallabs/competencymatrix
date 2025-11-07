import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized or home if role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const ManagerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['manager', 'admin']}>
    {children}
  </ProtectedRoute>
);

export const EmployeeRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
    {children}
  </ProtectedRoute>
);
