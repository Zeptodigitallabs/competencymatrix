import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector(state => state.auth);
  const location = useLocation();

  if (loading) {
    // Show loading spinner or skeleton while checking auth
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    // User doesn't have required role, redirect to home or show unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Role-specific route components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const ManagerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'manager']}>
    {children}
  </ProtectedRoute>
);

export const EmployeeRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'manager', 'employee']}>
    {children}
  </ProtectedRoute>
);
