import axios from 'axios';

// Centralized HTTP adapter keeps transport concerns out of components and makes client swaps trivial.
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  let formData;
  
  // If there's an avatar, use FormData to send the request
  if (userData.avatar && userData.avatar.startsWith('data:image')) {
    formData = new FormData();
    // Convert base64 to blob
    const response = await fetch(userData.avatar);
    const blob = await response.blob();
    formData.append('avatar', blob, 'avatar.jpg');
    
    // Add other fields
    Object.keys(userData).forEach(key => {
      if (key !== 'avatar' && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
  } else {
    // If no avatar, send JSON
    formData = userData;
  }

  const config = {
    headers: formData instanceof FormData ? {
      'Content-Type': 'multipart/form-data'
    } : {
      'Content-Type': 'application/json'
    }
  };

  const response = await api.put('/users/profile', formData, config);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete('/users/profile');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export default api;