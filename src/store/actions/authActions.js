import { 
  LOGIN_REQUEST, 
  LOGIN_SUCCESS, 
  LOGIN_FAIL, 
  LOGOUT, 
  LOAD_USER,
  AUTH_ERROR,
  CLEAR_ERROR
} from './types';
import AuthService from '../../services/AuthService/auth.service';
import { fetchUserInfo } from './userInfoActions';

export const login = (username, password, isLogout, isRemember = false) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    
    const response = await AuthService.loginWithCredentials(
      { username, password, isLogout, isRemember },
      (res) => res,
      (err) => { throw err; }
    );

    const { token } = response;
    
    if (token) {
      // Store token first
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { token }
      });
      
      // Then fetch and store user info
      try {
        const userInfo = await dispatch(fetchUserInfo());
        // User info is now stored in the user slice of the store
        return { success: true, userInfo };
      } catch (error) {
        console.error('Error fetching user info:', error);
        // Even if user info fetch fails, we still consider login successful
        // since we have a valid token
        return { success: true };
      }
    } else {
      throw new Error('Invalid response from server');
    }
    
    return response;
  } catch (error) {   
    let errorPayload = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      details: null
    };

    if (error.response) {
      // Handle HTTP errors
      if (error.response.status === 401) {
        if (error.response.data?.isMultilogedIn) {
          errorPayload = {
            message: error.response.data.error || 'You are already logged in on another device',
            code: 'MULTI_LOGIN',
            details: error.response.data
          };
        } else {
          errorPayload = {
            message: error.response.data?.error || 'Invalid credentials',
            code: 'INVALID_CREDENTIALS',
            details: error.response.data
          };
        }
      } else if (error.response.status >= 500) {
        errorPayload = {
          message: 'Server error. Please try again later.',
          code: 'SERVER_ERROR',
          details: error.response.data
        };
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorPayload = {
        message: 'No response from server. Please check your connection.',
        code: 'NETWORK_ERROR',
        details: null
      };
    } else if (error.message) {
      errorPayload = {
        message: error.message,
        code: error.code || 'CLIENT_ERROR',
        details: error.details || null
      };
    }

    dispatch({
      type: LOGIN_FAIL,
      payload: errorPayload
    });
    
    throw error;
  }
};

export const loadUser = (isInitialLoad = false) => async (dispatch) => {
  try {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      if (!isInitialLoad) {
        dispatch({
          type: AUTH_ERROR,
          payload: {
            message: 'No authentication token found',
            code: 'NO_AUTH_TOKEN',
            details: null
          }
        });
      }
      return null;
    }
    
    // Here you would typically make an API call to get user data
    // For now, we'll just get from sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    if (!user) {
      dispatch({
        type: AUTH_ERROR,
        payload: {
          message: 'User data not found',
          code: 'USER_DATA_MISSING',
          details: null
        }
      });
      return null;
    }
    
    dispatch({
      type: LOAD_USER,
      payload: user
    });
    
    return user;
  } catch (err) {
    console.log(err);
    
    dispatch({
      type: AUTH_ERROR,
      payload: {
        message: 'An unexpected error occurred while loading user data',
        code: 'LOAD_USER_ERROR',
        details: err
      }
    });
    
    return null;
  }
};

export const logout = () => (dispatch) => {
  try {
    // Clear all auth data from storage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear any existing errors
    dispatch({ type: CLEAR_ERROR });
    
    // Dispatch logout action
    dispatch({
      type: LOGOUT,
      payload: {
        message: 'Successfully logged out',
        code: 'LOGOUT_SUCCESS',
        timestamp: new Date().toISOString()
      }
    });
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    dispatch({
      type: AUTH_ERROR,
      payload: {
        message: 'Error during logout',
        code: 'LOGOUT_ERROR',
        details: error.message
      }
    });
    return false;
  } finally {
    // Redirect to login page
    window.location.href = '/login';
  }
};
