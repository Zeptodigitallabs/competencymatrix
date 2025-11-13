import * as actionTypes from '../actions/actionTypes';

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
  changingPassword: false,
  passwordChanged: false,
  profilePicture: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch User Info
    case actionTypes.FETCH_USERINFO_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actionTypes.SET_USERINFO:
      return {
        ...state,
        userInfo: action.payload,
        loading: false,
        error: null
      };

    case actionTypes.FETCH_USERINFO_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    // Change Password
    case actionTypes.POST_CHANGE_PASSWORD_START:
      return {
        ...state,
        changingPassword: true,
        passwordChanged: false,
        error: null
      };

    case actionTypes.POST_CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changingPassword: false,
        passwordChanged: true,
        error: null
      };

    case actionTypes.POST_CHANGE_PASSWORD_FAILED:
      return {
        ...state,
        changingPassword: false,
        passwordChanged: false,
        error: action.payload
      };

    // Profile Picture
    case actionTypes.SET_PROFILE_PICTURE:
      return {
        ...state,
        profilePicture: action.payload,
        error: null
      };

    // Auth Error
    case actionTypes.AUTH_ERROR:
      return {
        ...initialState
      };

    default:
      return state;
  }
};

export default userReducer;
