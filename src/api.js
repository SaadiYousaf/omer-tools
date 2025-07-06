// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-api-endpoint.com/api'
});

export default api;