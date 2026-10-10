import api from './api';

// User Registration & Login
export const registerUser = async (userData) => {
  const response = await api.post('/auth/user/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/user/login', credentials);
  return response.data;
};

// Organizer Registration & Login
export const registerOrganizer = async (orgData) => {
  const response = await api.post('/auth/organizer/register', orgData);
  return response.data;
};

export const loginOrganizer = async (credentials) => {
  const response = await api.post('/auth/organizer/login', credentials);
  return response.data;
};

// Common Auth Endpoints
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post('/auth/refresh', { refreshToken });
  return response.data;
};
