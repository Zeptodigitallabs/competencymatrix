import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import storeConfig from './store';
import Login from './auth/Login';
import { AdminRoute, ManagerRoute, EmployeeRoute } from './auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AuthService from './services/AuthService/auth.service';
import { renderRoutes } from './routes';

const { store, persistor } = storeConfig;

// Main App component with routing
const App = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppRoutes />
        </Router>
      </PersistGate>
    </Provider>
  </ErrorBoundary>
);

// Component to handle authenticated routes
const AppRoutes = () => {
  // All hooks must be called at the top level
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Get auth state and user info from Redux
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const user = useSelector(state => state.user?.userInfo);
  const userRole = user?.userType;
  const [isLoading, setIsLoading] = useState(true);

  // Set loading to false once we have the user role or confirm it's a public route
  useEffect(() => {
    if (!isAuthenticated || (isAuthenticated && userRole !== undefined)) {
      setIsLoading(false);
    }
  }, [isAuthenticated, userRole]);
  
  // Handle navigation after login
  useEffect(() => {
    if (isAuthenticated && userRole) {
      const userType = userRole.toLowerCase();
      // Only navigate if we have a valid path
      if (location.pathname === '/' || location.pathname === '/login' || location.pathname.includes('undefined')) {
        navigate(`/${userType}/dashboard`, { replace: true });
      }
    }
  }, [isAuthenticated, userRole, navigate, location.pathname]);

  // Logout handler
  const handleLogout = () => {
    AuthService.logout();
  };

  // Show loading state while checking authentication or user data
  if (isLoading || (isAuthenticated && userRole === undefined)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleSelectEmployee = (employee, viewName = 'employees') => {
    // In a real app, you might want to set the selected employee in state
    // and navigate to the employee details page
    if (viewName) {
      navigate(`/${userRole.toLowerCase()}/${viewName}`);
    }
  };

  // Render the appropriate routes based on authentication state
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to={`/${userRole?.toLowerCase()}/dashboard`} replace />
          ) : (
            <Login />
          )
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Navigate to={`/${userRole?.toLowerCase()}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      {/* Role-based routes */}
      {isAuthenticated && (
        <Route 
          path="/*" 
          element={
            <>
              {userRole === 'InstitutionAdmin' && (
                <AdminRoute userRole={userRole}> 
                  {renderRoutes({
                    userRole,
                    onSelectEmployee: handleSelectEmployee
                  })}
                </AdminRoute>
              )}
              {userRole === 'Manager' && (
                <ManagerRoute userRole={userRole}>
                  {renderRoutes({
                    userRole,
                    onSelectEmployee: handleSelectEmployee
                  })}
                </ManagerRoute>
              )}
              {userRole === 'Learner' && (
                <EmployeeRoute userRole={userRole}>
                  {renderRoutes({
                    userRole,
                    onSelectEmployee: handleSelectEmployee
                  })}
                </EmployeeRoute>
              )}
            </>
          } 
        />
      )}
      
      {/* Catch-all route */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            <Navigate to={`/${userRole?.toLowerCase()}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
};

export default App;