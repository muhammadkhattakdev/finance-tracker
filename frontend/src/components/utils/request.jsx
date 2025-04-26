import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token';
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token';
const AUTH_LOGIN_ENDPOINT = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || '/auth/token/';
const AUTH_REGISTER_ENDPOINT = import.meta.env.VITE_AUTH_REGISTER_ENDPOINT || '/auth/register/';
const AUTH_USER_ENDPOINT = import.meta.env.VITE_AUTH_USER_ENDPOINT || '/auth/user/';
const AUTH_REFRESH_ENDPOINT = import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || '/auth/token/refresh/';


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (token, error) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });
  failedQueue = [];
};

const formatError = (error) => {
  const formattedError = {
    status: error.response?.status || 500,
    message: 'An unexpected error occurred',
    details: null,
  };

  if (error.response?.data) {
    // Handle DRF specific error formats
    if (typeof error.response.data === 'string') {
      formattedError.message = error.response.data;
    } else if (typeof error.response.data === 'object') {
      // Handle validation errors (often nested under fields)
      if (Object.keys(error.response.data).length > 0) {
        const firstErrorField = Object.keys(error.response.data)[0];
        const firstError = error.response.data[firstErrorField];
        
        if (Array.isArray(firstError) && firstError.length > 0) {
          formattedError.message = `${firstErrorField}: ${firstError[0]}`;
        } else if (typeof firstError === 'string') {
          formattedError.message = `${firstErrorField}: ${firstError}`;
        } else if (error.response.data.detail) {
          formattedError.message = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
          formattedError.message = error.response.data.non_field_errors[0];
        }
      }
      
      formattedError.details = error.response.data;
    }
  } else if (error.message) {
    formattedError.message = error.message;
  }

  console.error('Formatted error:', formattedError);
  return formattedError;
};

// Clear authentication data
const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.location.href = '/login';
};

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        processQueue(null, new Error('No refresh token available'));
        isRefreshing = false;
        clearAuth();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}${AUTH_REFRESH_ENDPOINT}`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem(AUTH_TOKEN_KEY, access);
        
        // Process all queued requests with new token
        processQueue(access, null);
        isRefreshing = false;
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(null, refreshError);
        isRefreshing = false;
        clearAuth();
        return Promise.reject(refreshError);
      }
    }

    // Network errors handling
    if (error.message === 'Network Error') {
      // Handle network errors, potentially with retry logic
      console.error('Network error occurred');
    }

    return Promise.reject(formatError(error));
  }
);

// Utility function to create a cancelable request
const createCancelToken = () => {
  const source = axios.CancelToken.source();
  return {
    token: source.token,
    cancel: source.cancel,
  };
};

// Main request methods
const Request = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  
  patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
  
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  
  // Authentication specific methods
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(AUTH_LOGIN_ENDPOINT, { email, password });
      const { access, refresh } = response.data;
      
      localStorage.setItem(AUTH_TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },
  
  register: async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await axiosInstance.post(AUTH_REGISTER_ENDPOINT, userData);
      console.log('Registration success:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw formatError(error);
    }
  },
  
  logout: () => {
    clearAuth();
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  // Utility methods
  cancelToken: createCancelToken,
  
  setAuthToken: (token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  
  getAuthToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  setRefreshToken: (token) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
};

export default Request;