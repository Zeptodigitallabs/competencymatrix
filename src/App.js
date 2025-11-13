import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import storeConfig from './store';
import CompetencyMatrixApp from './CompetencyMatrixApp';
import Login from './auth/Login';
import { AdminRoute, ManagerRoute, EmployeeRoute } from './auth/ProtectedRoute';
import { loadUser } from './store/actions/authActions';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const { store, persistor } = storeConfig;

// Component to handle authenticated routes
const AppRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Get auth state and user info from Redux
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const user = useSelector(state => state.user?.userInfo);
  
  // Load user on initial render
  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     try {
  //       setLoading(true);
  //       await dispatch(loadUser(true)); // Pass true to indicate initial load
  //     } catch (error) {
  //       console.error('Error loading user:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   initializeAuth();
  // }, [dispatch]);
  
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If on login page and already authenticated, redirect to dashboard
  if (isAuthenticated && (location.pathname === '/' || location.pathname === '/login')) {
    const userType = user?.userType?.toLowerCase() || 'learner';
    return <Navigate to={`/${userType}`} replace />;
  }

  // Determine user role with a default of 'learner' if not available
  const userRole = user?.userType?.toLowerCase() || 'learner';
  
  
  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/institutionadmin/*"
        element={
          <AdminRoute userRole={userRole}>
            <CompetencyMatrixApp userRole={userRole} />
          </AdminRoute>
        }
      />
      
      {/* Manager Routes */}
      <Route
        path="/manager/*"
        element={
          <ManagerRoute userRole={userRole}>
            <CompetencyMatrixApp userRole={userRole} />
          </ManagerRoute>
        }
      />
      
      {/* Learner/Employee Routes */}
      <Route
        path="/learner/*"
        element={
          <EmployeeRoute userRole={userRole}>
            <CompetencyMatrixApp userRole={userRole} />
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