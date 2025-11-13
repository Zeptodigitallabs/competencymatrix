import React, { useEffect } from 'react';
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
  
  // Get auth state and user info from Redux
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const user = useSelector(state => state.user?.userInfo);
  
  console.log('Auth state:', { isAuthenticated, user });
  
  // Load user on initial render
  // useEffect(() => {
  //   dispatch(loadUser(true)); // Pass true to indicate initial load
  // }, [dispatch]);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If on login page and already authenticated, redirect to home
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  // Determine user role with a default of 'employee' if not available
  const userRole = user?.userType || 'Learner';
  
  return (
    <Routes>
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <CompetencyMatrixApp userRole={userRole} />
          </AdminRoute>
        }
      />
      
      {/* Manager Routes */}
      <Route
        path="/manager/*"
        element={
          <ManagerRoute>
            <CompetencyMatrixApp userRole={userRole} />
          </ManagerRoute>
        }
      />
      
      {/* Employee Routes */}
      <Route
        path="/employee/*"
        element={
          <EmployeeRoute>
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