import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = ({ message, type = 'success' }) => {
  useEffect(() => {
    if (message) {
      toast[type](message);
    }
  }, [message, type]);

  return null;
};

export default Toast;