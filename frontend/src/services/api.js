import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for cookies/session
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add generic error logger response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silently ignore expected 401 status (it means just not logged in yet) 
    // rather than logging it as a dangerous error exception
    if (error.response?.status === 401) {
        return Promise.reject(error);
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
