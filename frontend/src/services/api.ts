import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('amfi_token');
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('amfi_token');
        localStorage.removeItem('amfi_user');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        toast.error('Sessão expirada. Faça login novamente.');
      } else if (status === 403) {
        toast.error(data.error || 'Acesso negado');
      } else if (status >= 400 && status < 500) {
        toast.error(data.error || 'Erro na requisição');
      } else if (status >= 500) {
        toast.error('Erro interno do servidor. Tente novamente.');
      }
    } else if (error.request) {
      toast.error('Erro de conexão. Verifique sua internet.');
    } else {
      toast.error('Erro inesperado. Tente novamente.');
    }
    
    return Promise.reject(error);
  }
);

export default api;