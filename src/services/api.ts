import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://incit-auth-be-production.up.railway.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api; 