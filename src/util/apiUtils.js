/**
 * Handles API errors consistently across the application
 * @param {Error} error - The error object from the API call
 * @returns {string} - A user-friendly error message
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    
    if (status === 401) {
      return 'Your session has expired. Please log in again.';
    }
    
    if (status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (status === 404) {
      return 'The requested resource was not found.';
    }
    
    if (status >= 500) {
      return 'A server error occurred. Please try again later.';
    }
    
    // Try to get error message from response data
    if (data && data.message) {
      return data.message;
    }
    
    if (data && data.error) {
      return data.error;
    }
    
    return `Request failed with status code ${status}`;
  }
  
  if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your internet connection.';
  }
  
  // Something happened in setting up the request that triggered an Error
  return error.message || 'An unexpected error occurred.';
};

/**
 * Creates a standardized API response
 * @param {boolean} success - Whether the API call was successful
 * @param {any} data - The response data
 * @param {string} message - A message describing the result
 * @returns {Object} - A standardized response object
 */
export const createApiResponse = (success, data = null, message = '') => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString()
});

/**
 * Validates if the response has the expected structure
 * @param {Object} response - The API response to validate
 * @returns {boolean} - True if the response is valid, false otherwise
 */
export const isValidResponse = (response) => {
  return response && typeof response === 'object' && 'data' in response;
};
