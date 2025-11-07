import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // In a real app, you would make an API call to authenticate
    // This is a mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock user data based on email
        let userData;
        if (email.includes('admin')) {
          userData = {
            id: '1',
            name: 'Admin User',
            email,
            role: 'admin',
            department: 'Administration'
          };
        } else if (email.includes('manager')) {
          userData = {
            id: '2',
            name: 'Manager User',
            email,
            role: 'manager',
            department: 'Engineering',
            team: ['e1', 'e2']
          };
        } else {
          userData = {
            id: '3',
            name: 'Employee User',
            email,
            role: 'employee',
            department: 'Engineering',
            manager: '2'
          };
        }
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        resolve(userData);
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
