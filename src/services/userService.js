// src/services/userService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiClient.post('/users/change-password', passwordData);
    return response.data;
  },

  // Get user addresses
  getAddresses: async () => {
    const response = await apiClient.get('/addresses');
    return response.data;
  },

  // Create new address
  createAddress: async (addressData) => {
    const response = await apiClient.post('/addresses', addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (id, addressData) => {
    const response = await apiClient.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id) => {
    const response = await apiClient.delete(`/addresses/${id}`);
    return response.data;
  },

  // Set default address
  setDefaultAddress: async (id) => {
    const response = await apiClient.post(`/addresses/${id}/set-default`);
    return response.data;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await apiClient.get('/paymentmethods');
    return response.data;
  },

  // Create payment method
  createPaymentMethod: async (paymentData) => {
    const response = await apiClient.post('/paymentmethods', paymentData);
    return response.data;
  },

  // Update payment method
  updatePaymentMethod: async (id, paymentData) => {
    const response = await apiClient.put(`/paymentmethods/${id}`, paymentData);
    return response.data;
  },

  // Delete payment method
  deletePaymentMethod: async (id) => {
    const response = await apiClient.delete(`/paymentmethods/${id}`);
    return response.data;
  },

  // Set default payment method
  setDefaultPaymentMethod: async (id) => {
    const response = await apiClient.post(`/paymentmethods/${id}/set-default`);
    return response.data;
  },

  // Get user preferences
  getPreferences: async () => {
    const response = await apiClient.get('/preferences');
    return response.data;
  },
  deleteAccount: async () => {
    const response = await apiClient.delete('/users/account');
    return response.data;
  },
  // Update user preferences
  updatePreferences: async (preferencesData) => {
    const response = await apiClient.put('/preferences', preferencesData);
    return response.data;
  },
};

export default userService;