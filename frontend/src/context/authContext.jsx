import React, { createContext, useState, useContext, useEffect } from 'react';
import Request from '../components/utils/request';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (Request.isAuthenticated()) {
        try {
          const response = await Request.get(import.meta.env.VITE_AUTH_USER_ENDPOINT);
          setCurrentUser(response.data);
        } catch (error) {
          Request.logout();
          setCurrentUser(null);
        };
      };
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await Request.login(email, password);
    
    const userResponse = await Request.get('/auth/user/');
    setCurrentUser(userResponse.data);
    
    return data;
  };

  const register = async (userData) => {
    return await Request.register(userData);
  };

  // Logout function
  const logout = () => {
    Request.logout();
    setCurrentUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    const response = await Request.patch(import.meta.env.VITE_AUTH_USER_ENDPOINT, userData);
    setCurrentUser(response.data);
    return response.data;
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: Request.isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;