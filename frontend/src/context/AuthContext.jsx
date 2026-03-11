import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

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

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        } else {
        //   console.log(user);
          
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data.data;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return response.data;
  };

  const signup = async (name, email, password) => {
    const response = await authAPI.signup({ name, email, password });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
