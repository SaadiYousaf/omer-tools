// src/api/axiosConfig.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5117/api',
  headers: {
    'Content-Type': 'application/json',
    // You can add any default headers here
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can modify requests here (e.g., add auth token)
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    // You can modify responses here
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('API Error:', error.response.status, error.response.data);
      
      // You can add specific error handling here
      // if (error.response.status === 401) {
      //   // Handle unauthorized
      // }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;