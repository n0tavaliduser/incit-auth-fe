import axios from 'axios';

const isProduction = import.meta.env.PROD;

const api = axios.create({
  baseURL: isProduction 
    ? 'https://incit-auth-be-production.up.railway.app'
    : 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': isProduction 
      ? 'https://incit-auth-fe.vercel.app'
      : 'http://localhost:3000'
  }
});

// Add error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default api; 