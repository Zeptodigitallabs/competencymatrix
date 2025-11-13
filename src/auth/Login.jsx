import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, loadUser } from '../store/actions/authActions';
import AlertDialog from '../components/common/AlertDialog/AlertDialog';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    isRemember: false
  });
  
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  const [alert, setAlert] = useState({
    message: '',
    type: 'error'
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Clear any existing errors on component mount
  useEffect(() => {
    return () => {
      // Clear any errors when component unmounts
      dispatch({ type: 'CLEAR_ERROR' });
    };
  }, [dispatch]);

  // Handle error state changes
  useEffect(() => {
    if (error) {
      // Ensure we have a string message to display
      let displayMessage = 'An error occurred';
      let alertType = 'error';
      
      if (typeof error === 'string') {
        displayMessage = error;
      } else if (error && typeof error === 'object') {
        // Handle error object
        displayMessage = error.message || 'An error occurred';
        alertType = error.code === 'MULTI_LOGIN' ? 'custom_info' : 'error';
      }
      
      setAlert({
        message: displayMessage,
        type: alertType
      });
    } else {
      setAlert({
        message: '',
        type: 'error'
      });
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onCloseAlert = () => {
    setAlert(prevState => ({
      ...prevState,
      message: ''
    }));
    
    if (alert.type === 'custom_info') {
      // Call the same login function but with forceLogout = '1'
      logIN(formData.username, formData.password, '1');
    }
  };

  const logIN = async (username, password, forceLogout = '') => {
    try {
      if (!username || !password) {
        throw new Error('Please enter both username and password');
      }
      
      // Clear previous errors
      dispatch({ type: 'CLEAR_ERROR' });
      
      // Dispatch login action
      const result = await dispatch(login(username, password,forceLogout, formData.isRemember))
      
 
    } catch (error) {
      console.error('Login process error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logIN(formData.username, formData.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              contact your administrator for access
            </span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {alert.message && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {typeof alert.message === 'string' ? alert.message : 'An error occurred'}
                  </h3>
                </div>
              </div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="isRemember"
                name="isRemember"
                type="checkbox"
                checked={formData.isRemember}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isRemember" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        {/* <div className="mt-4 text-center text-sm text-gray-600">
          <p>Demo logins:</p>
          <p>Admin: admin@example.com / any password</p>
          <p>Manager: manager@example.com / any password</p>
          <p>Employee: employee@example.com / any password</p>
        </div> */}
      </div>
      <AlertDialog
        open={alert.message.length > 0}
        onClose={onCloseAlert}
        ContentText={alert.message}
        title={alert.message.includes('already logged in') ? 'Session Error' : 'Authentication Error'}
        type="error"
        action={[
          {
            text: 'OK',
            onPress: onCloseAlert
          }
        ]}
      />
    </div>
  );
};

export default Login;
