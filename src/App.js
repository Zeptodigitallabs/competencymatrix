import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import storeConfig from './store';
import CompetencyMatrixApp from './CompetencyMatrixApp';
import Login from './auth/Login';
import { AdminRoute, ManagerRoute, EmployeeRoute } from './auth/ProtectedRoute';
import { loadUser } from './store/actions/authActions';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import AuthService from './services/AuthService/auth.service';

const { store, persistor } = storeConfig;

// Component to handle authenticated routes
const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get auth state and user info from Redux
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const user = useSelector(state => state.user?.userInfo);
  
  // Handle navigation after login
  useEffect(() => {
    if (isAuthenticated && user?.userType) {
      const userType = user.userType.toLowerCase();
      if (location.pathname === '/' || location.pathname === '/login') {
        navigate(`/${userType}`, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname]);


  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && location.pathname !== '/login') {
    // Clear any existing auth data
    AuthService.logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Logout handler
  const handleLogout = () => {
    AuthService.logout();
  };




  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/institutionadmin/*"
        element={
          <AdminRoute >
            <CompetencyMatrixApp userRole={user?.userType} onLogout={handleLogout} />
          </AdminRoute>
        }
      />

      {/* Manager Routes */}
      <Route
        path="/manager/*"
        element={
          <ManagerRoute >
            <CompetencyMatrixApp userRole={user?.userType} onLogout={handleLogout} />
          </ManagerRoute>
        }
      />

      {/* Learner/Employee Routes */}
      <Route
        path="/learner/*"
        element={
          <EmployeeRoute >
            <CompetencyMatrixApp userRole={user?.userType} onLogout={handleLogout} />
          </EmployeeRoute>
        }
      />
    </Routes>
  );
};

// Main App with routing
const App = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  </ErrorBoundary>
);


export default App;