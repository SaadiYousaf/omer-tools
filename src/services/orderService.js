// src/services/orderService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5117/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const orderService = {
  // Get user orders
  getOrders: async () => {
    const response = await apiClient.get('/orders/user');
    return response.data;
  },

  // Get order by ID
  getOrder: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await apiClient.put(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default orderService;