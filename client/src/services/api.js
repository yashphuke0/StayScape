import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  signup: (userData) => api.post('/users/signup', userData),
  logout: () => api.post('/users/logout'),
  getCurrentUser: () => api.get('/users/me'),
};

// Listings APIs
export const listingsAPI = {
  getAll: (searchQuery) => {
    const params = searchQuery ? { search: searchQuery } : {};
    return api.get('/listings', { params });
  },
  getById: (id) => api.get(`/listings/${id}`),
  create: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/listings', formData, config);
  },
  update: (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.put(`/listings/${id}`, formData, config);
  },
  delete: (id) => api.delete(`/listings/${id}`),
};

// Reviews APIs
export const reviewsAPI = {
  create: (listingId, reviewData) => api.post(`/listings/${listingId}/reviews`, reviewData),
  delete: (listingId, reviewId) => api.delete(`/listings/${listingId}/reviews/${reviewId}`),
};

export default api; 