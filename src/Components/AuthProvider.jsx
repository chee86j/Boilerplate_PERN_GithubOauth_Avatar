import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserData } from '../store/authSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await dispatch(fetchUserData()).unwrap();
        } catch (error) {
          // If there's an error fetching user data, the error will be handled by the auth slice
          console.error('Failed to restore auth state:', error);
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return children;
};

export default AuthProvider; 