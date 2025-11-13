import axiosConfig from '../../util/axios';

const UserService = {
  /**
   * Fetches user details from the server
   * @returns {Promise<Object>} User details
   */
  getUserDetails: async () => {
    try {
      const response = await axiosConfig().get('/AppCore/GetUserDetails');
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },

  /**
   * Updates user profile information
   * @param {Object} userData - The updated user data
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (userData) => {
    try {
      const response = await axiosConfig().put('/AppCore/UpdateProfile', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Changes user password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Response data
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await axiosConfig().post('/AppCore/ChangePassword', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  /**
   * Uploads a new profile picture
   * @param {File} file - The image file to upload
   * @returns {Promise<Object>} Upload result
   */
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axiosConfig().post('/AppCore/UploadProfilePicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }
};

export default UserService;
