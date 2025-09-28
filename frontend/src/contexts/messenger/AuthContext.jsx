import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing authentication on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('messenger_token');
      if (token) {
        const userData = await authService.getProfile(token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          // Store in localStorage for persistence across sessions
          localStorage.setItem('messenger_user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      localStorage.removeItem('messenger_token');
      localStorage.removeItem('messenger_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      if (response.access_token && response.user) {
        // Store authentication data
        localStorage.setItem('messenger_token', response.access_token);
        localStorage.setItem('messenger_user', JSON.stringify(response.user));
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        return { success: true, user: response.user };
      }
      
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const newUser = await authService.register(userData);
      
      if (newUser) {
        // Auto-login after successful registration
        const loginResult = await login(userData.email, userData.password);
        return loginResult;
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear local storage
      localStorage.removeItem('messenger_token');
      localStorage.removeItem('messenger_user');
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      // Close any WebSocket connections
      // This will be handled by the WebSocket context
      
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error: 'Logout failed' };
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (status) => {
    try {
      const token = localStorage.getItem('messenger_token');
      if (token && user) {
        await authService.updateStatus(status, token);
        setUser(prev => ({ ...prev, status }));
      }
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUserStatus,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;