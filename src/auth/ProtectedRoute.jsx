import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const user = useSelector(state => state.user?.userInfo);
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
  // Update role checks to be case-insensitive
  if (allowedRoles.length > 0 && (!user || !allowedRoles.some(role =>
    role.toLowerCase() === user?.userType?.toLowerCase()
  ))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Role-specific route components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['InstitutionAdmin']}>
    {children}
  </ProtectedRoute>
);

export const ManagerRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['InstitutionAdmin', 'Manager']}>
    {children}
  </ProtectedRoute>
);

export const EmployeeRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['InstitutionAdmin', 'Manager', 'Learner']}>
    {children}
  </ProtectedRoute>
);
