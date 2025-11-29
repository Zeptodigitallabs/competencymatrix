import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, allowedRoles = [],userRole }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  const location = useLocation();

  console.log(userRole);
  
  if (loading) {
    // Show loading spinner or skeleton while checking auth
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to unauthorized or home if role not allowed
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

// Role-specific route components
export const AdminRoute = ({ children, userRole }) => (
  <ProtectedRoute allowedRoles={['InstitutionAdmin']} userRole={userRole}>
    {children}
  </ProtectedRoute>
);

export const ManagerRoute = ({ children, userRole }) => (
  <ProtectedRoute allowedRoles={['InstitutionAdmin', 'Manager']} userRole={userRole}>
    {children}
  </ProtectedRoute>
);

export const EmployeeRoute = ({ children, userRole }) => (
  <ProtectedRoute allowedRoles={['InstitutionAdmin', 'Manager', 'Learner']} userRole={userRole}>
    {children}
  </ProtectedRoute>
);
