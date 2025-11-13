import axiosConfig from '../../util/axios';
import { StoreUserData } from '../../util/commonfunctions';

class AuthService {
  static loginWithCredentials(auth, onSuccess, onError, onFinal) {
    let TOKEN = sessionStorage.getItem('token');
    
    return axiosConfig().post(`AuthenticateUser`,
      {
        token: TOKEN || '',
        forcelogout: auth.isLogout || false
      },
      {
        auth: {
          username: auth.username,
          password: auth.password
        }
      })
      .then(response => {

        // Store token in session storage
        if (response.data?.authToken) {
          sessionStorage.setItem('token', response.data.authToken);
          
          // Store user data if remember me is checked
          if (auth.isRemember) {
            StoreUserData(auth.username, auth.password, true);
          }

          // Prepare user data
          const userData = {
            user: {
              username: auth.username,
              ...(response.data.user || {}) // Safely include user data if available
            },
            token: response.data.authToken
          };
          
          // Call success handler with user data
          onSuccess(userData);
          
          onSuccess(userData);
          return userData;
        }
        
        // Handle empty or invalid responses
        const error = new Error('Authentication failed: Invalid server response');
        error.response = response;
        onError(error);
        return null;
      })
      .catch(error => {
        // Clear auth data on error if not remembering
        
        if (!auth.isRemember) {
          localStorage.clear();
          sessionStorage.clear();
        }
        
        // Check if we have a response with error message
        if (error.response?.data?.error) {
          // Create a new error with the server's error message
          const serverError = new Error(error.response.data.error);
          serverError.response = error.response;
          onError(serverError);
          //throw serverError;
        }
        
        onError(error);
        //throw error;
      })
      .finally(onFinal);
  }
  
  static logout() {
    // Clear all auth data
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = '/login';
  }
  
  static isAuthenticated() {
    return !!sessionStorage.getItem('token');
  }
  
  static getAuthToken() {
    return sessionStorage.getItem('token');
  }
}

export default AuthService;
