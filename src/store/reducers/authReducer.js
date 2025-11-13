import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOAD_USER,
  AUTH_ERROR
} from '../actions/types';

const initialState = {
  token: sessionStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case LOGIN_SUCCESS:
      // Save token to session storage
      if (payload.token) {
        sessionStorage.setItem('token', payload.token);
      }
      
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case LOAD_USER:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case LOGIN_FAIL:
    case AUTH_ERROR:
      // Remove token on auth error
      sessionStorage.removeItem('token');
      
      // Ensure error is always an object
      const errorObj = typeof payload === 'string' 
        ? { message: payload, code: 'AUTH_ERROR' } 
        : { ...payload, code: payload?.code || 'AUTH_ERROR' };
      
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: errorObj
      };
    
    case LOGOUT:
      // Clear all auth data
      sessionStorage.removeItem('token');
      
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
}
