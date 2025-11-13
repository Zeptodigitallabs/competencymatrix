import * as actionTypes from './actionTypes';
import axios from '../../util/axios';
import UserService from '../../services/UserService/user.service';

// Action Creators
export const fetchUserInfoStart = () => ({
  type: actionTypes.FETCH_USERINFO_START
});

export const setUserInfo = (userInfo) => ({
  type: actionTypes.SET_USERINFO,
  payload: userInfo
});

export const fetchUserInfoFailed = (error) => ({
  type: actionTypes.FETCH_USERINFO_FAILED,
  payload: {
    message: error.message || 'Failed to fetch user info',
    code: error.code || 'FETCH_USER_INFO_ERROR',
    details: error.details || null
  }
});

// Thunk Actions
export const fetchUserInfo = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchUserInfoStart());
      const userData = await UserService.getUserDetails();
      
      if (userData.isSuccess === false) {
        throw new Error(userData.message || 'Failed to fetch user info');
      }
      
      dispatch(setUserInfo(userData));
      return userData;
    } catch (error) {
      console.error('Error in fetchUserInfo:', error);
      dispatch(fetchUserInfoFailed({
        message: error.response?.data?.message || error.message,
        code: error.code || 'FETCH_USER_INFO_FAILED',
        details: error.response?.data || null
      }));
      throw error;
    }
  };
};

// Change Password Actions
export const changePasswordStart = () => ({
  type: actionTypes.POST_CHANGE_PASSWORD_START
});

export const changePasswordSuccess = () => ({
  type: actionTypes.POST_CHANGE_PASSWORD_SUCCESS
});

export const changePasswordFailed = (error) => ({
  type: actionTypes.POST_CHANGE_PASSWORD_FAILED,
  payload: error
});

export const changePassword = (oldPassword, newPassword) => {
  return async (dispatch) => {
    try {
      dispatch(changePasswordStart());
      const response = await axios().post('/AppCore/ChangePassword', { oldPassword, newPassword });
      dispatch(changePasswordSuccess());
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch(changePasswordFailed(errorMessage));
      throw error;
    }
  };
};

// Profile Picture Actions
export const setProfilePicture = (profilePic) => ({
  type: actionTypes.SET_PROFILE_PICTURE,
  payload: profilePic
});

export const uploadProfilePicture = (file) => {
  return async (dispatch) => {
    try {
      const response = await UserService.uploadProfilePicture(file);
      dispatch(setProfilePicture(response.profilePicUrl));
      return response;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  };
};

// Logout Action
export const logoutUser = () => ({
  type: actionTypes.USER_LOGOUT
});
