import api from './api';

// Organizer Registration
export const registerOrganizer = async (data) => {
  const response = await api.post('/organizers/register', data);
  return response.data;
};

// Organizer Login
export const loginOrganizer = async (credentials) => {
  const response = await api.post('/organizers/login', credentials);
  return response.data;
};

// Fetch current organizer's profile
export const getOrganizerProfile = async () => {
  const response = await api.get('/organizers/profile');
  return response.data;
};

// Update current organizer's profile
export const updateOrganizerProfile = async (data) => {
  const response = await api.put('/organizers/profile', data);
  return response.data;
};

// Fetch organizer dashboard KPIs and event analytics
export const getOrganizerDashboard = async () => {
  const response = await api.get('/organizers/dashboard');
  return response.data;
};

// Fetch events owned by current organizer
export const getOrganizerEvents = async () => {
  const response = await api.get('/organizers/events');
  return response.data;
};

// Create an event bound to current organizer
export const createOrganizerEvent = async (eventData) => {
  const response = await api.post('/organizers/events', eventData);
  return response.data;
};

// Update own event by ID
export const updateOrganizerEvent = async (id, eventData) => {
  const response = await api.put(`/organizers/events/${id}`, eventData);
  return response.data;
};

// Delete own event by ID
export const deleteOrganizerEvent = async (id) => {
  const response = await api.delete(`/organizers/events/${id}`);
  return response.data;
};

// Fetch public organizer details by ID
export const getPublicOrganizer = async (id) => {
  const response = await api.get(`/organizers/${id}`);
  return response.data;
};
