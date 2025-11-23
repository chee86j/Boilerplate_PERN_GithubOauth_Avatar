import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserData } from '../../store/authSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await dispatch(fetchUserData()).unwrap();
        } catch (error) {
          // Keep auth restoration scoped to this provider so routing stays lean and focused on navigation concerns.
          console.error('Failed to restore auth state:', error);
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return children;
};

export default AuthProvider;
