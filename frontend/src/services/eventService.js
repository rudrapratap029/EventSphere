import api from './api';

// Fetch all events with optional search, category, status filters
export const getEvents = async (params = {}) => {
  const response = await api.get('/events', { params });
  return response.data;
};

// Fetch a single event by ID
export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

// Create a new event
export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

// Update an existing event
export const updateEvent = async (id, eventData) => {
  const response = await api.put(`/events/${id}`, eventData);
  return response.data;
};

// Delete an event by ID
export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};
