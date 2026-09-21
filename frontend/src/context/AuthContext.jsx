import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, id, username: uName, email, role } = response.data.data;
      const userData = { id, username: uName, email, role };

      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      addToast(`Welcome back, ${uName}! Logged in as ${role === 'ROLE_ADMIN' ? 'Admin' : 'Customer'}.`, 'success');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      addToast(msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, role = 'ROLE_CUSTOMER') => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { username, email, password, role });
      const { token, id, username: uName, email: uEmail, role: uRole } = response.data.data;
      const userData = { id, username: uName, email: uEmail, role: uRole };

      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      addToast(`Account created successfully! Logged in as ${uName}.`, 'success');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    addToast('Logged out successfully', 'info');
  };

  const loginAsDemo = async (roleType) => {
    if (roleType === 'ADMIN') {
      return await login('admin', 'admin123');
    } else {
      return await login('customer', 'customer123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        loginAsDemo,
        isAdmin: user?.role === 'ROLE_ADMIN',
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
