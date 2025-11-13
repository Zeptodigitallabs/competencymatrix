/**
 * Storage utility for handling localStorage and sessionStorage operations
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const REMEMBER_ME_KEY = 'remember_me';

/**
 * Gets an item from storage with error handling
 * @param {Storage} storage - The storage object (localStorage or sessionStorage)
 * @param {string} key - The key to get
 * @param {any} defaultValue - Default value if item doesn't exist or parsing fails
 * @returns {any} The stored value or defaultValue
 */
const getItem = (storage, key, defaultValue = null) => {
  try {
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from storage:`, error);
    return defaultValue;
  }
};

/**
 * Sets an item in storage with error handling
 * @param {Storage} storage - The storage object (localStorage or sessionStorage)
 * @param {string} key - The key to set
 * @param {any} value - The value to store (will be stringified)
 */
const setItem = (storage, key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in storage:`, error);
  }
};

/**
 * Removes an item from storage
 * @param {Storage} storage - The storage object (localStorage or sessionStorage)
 * @param {string} key - The key to remove
 */
const removeItem = (storage, key) => {
  try {
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from storage:`, error);
  }
};

/**
 * Clears all items from storage
 * @param {Storage} storage - The storage object (localStorage or sessionStorage)
 */
const clear = (storage) => {
  try {
    storage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// Token management
export const getToken = () => getItem(sessionStorage, TOKEN_KEY);
export const setToken = (token) => setItem(sessionStorage, TOKEN_KEY, token);
export const removeToken = () => removeItem(sessionStorage, TOKEN_KEY);

// User data management
export const getUserData = () => {
  // Try to get from session storage first, then fall back to local storage
  return getItem(sessionStorage, USER_KEY) || getItem(localStorage, USER_KEY);
};

export const setUserData = (userData, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  // Clear from both storages first to avoid duplicates
  removeItem(sessionStorage, USER_KEY);
  removeItem(localStorage, USER_KEY);
  setItem(storage, USER_KEY, userData);
  setItem(localStorage, REMEMBER_ME_KEY, rememberMe);
};

export const removeUserData = () => {
  removeItem(sessionStorage, USER_KEY);
  removeItem(localStorage, USER_KEY);
  removeItem(localStorage, REMEMBER_ME_KEY);
};

// Remember me functionality
export const getRememberMe = () => {
  return getItem(localStorage, REMEMBER_ME_KEY, false);
};

export const setRememberMe = (value) => {
  setItem(localStorage, REMEMBER_ME_KEY, value);
};

// Clear all auth-related data
export const clearAuthData = () => {
  removeToken();
  removeUserData();
  // Keep remember me preference
};

// Clear all application data (use with caution!)
export const clearAllData = () => {
  clear(sessionStorage);
  clear(localStorage);
};
