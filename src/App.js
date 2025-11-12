import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import CompetencyMatrixApp from './CompetencyMatrixApp';
import Login from './auth/Login';
//import Login from './components/auth/Login';
import { AdminRoute, ManagerRoute, EmployeeRoute } from './auth/ProtectedRoute';

// Main App with routing
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Component to handle authenticated routes
const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <CompetencyMatrixApp userRole="admin" />
          </AdminRoute>
        }
      />
      
      {/* Manager Routes */}
      <Route
        path="/manager/*"
        element={
          <ManagerRoute>
            <CompetencyMatrixApp userRole="manager" />
          </ManagerRoute>
        }
      />
      
      {/* Employee Routes */}
      <Route
        path="/*"
        element={
          <EmployeeRoute>
            <CompetencyMatrixApp userRole={user.role} />
          </EmployeeRoute>
        }
      />
    </Routes>
  );
};

export default App;