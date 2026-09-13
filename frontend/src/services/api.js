import axios from 'axios';

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://online-quran-acedmy-lhto.onrender.com/api'
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
      }
    }

    return Promise.reject({
      ...error,
      message,
      errors: error.response?.data?.errors || [],
      status: error.response?.status,
    });
  }
);

export default api;
