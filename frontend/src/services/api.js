import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  verify: () => api.get('/auth/verify'),
};

// Posts API
export const postsAPI = {
  getFeed: (page = 1, limit = 20) => api.get(`/posts?page=${page}&limit=${limit}`),
  getPost: (postId) => api.get(`/posts/${postId}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (postId, postData) => api.put(`/posts/${postId}`, postData),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  addComment: (postId, content) => api.post(`/posts/${postId}/comment`, { content }),
  deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comment/${commentId}`),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
};

// Users API
export const usersAPI = {
  searchUsers: (query) => api.get(`/users/search?query=${query}`),
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  followUser: (userId) => api.post(`/users/${userId}/follow`),
};

// Admin API
export const adminAPI = {
  getStudents: (page = 1, limit = 50) => api.get(`/admin/students?page=${page}&limit=${limit}`),
  addStudent: (studentData) => api.post('/admin/students', studentData),
  bulkUploadStudents: (students) => api.post('/admin/students/bulk', { students }),
  updateStudent: (studentId, studentData) => api.put(`/admin/students/${studentId}`, studentData),
  deleteStudent: (studentId) => api.delete(`/admin/students/${studentId}`),
  getUsers: () => api.get('/admin/users'),
  getPosts: () => api.get('/admin/posts'),
  deletePost: (postId) => api.delete(`/admin/posts/${postId}`),
  getStats: () => api.get('/admin/stats'),
};

// Made By API
export const madeByAPI = {
  getDeveloperInfo: () => api.get('/made-by'),
};

export default api;



