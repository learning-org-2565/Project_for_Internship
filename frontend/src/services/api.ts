import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (email: string, password: string) => 
    api.post('/users/login', { email, password }),
  register: (name: string, email: string, password: string) => 
    api.post('/users', { name, email, password })
};

export interface ApplicationData {
  name: string;
  email: string;
  courseId: string;
  // Add any other fields expected by the API
}

export const applicationService = {
  submit: (data: ApplicationData) => api.post('/applications', data),
  getStatus: () => api.get('/applications/me'),
};

export const courseService = {
  getCourses: () => 
    api.get('/courses'),
  getCourseById: (id: string) => 
    api.get(`/courses/${id}`)
};
