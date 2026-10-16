import api from './api';

// Book ticket seats for an event
export const bookTicket = async (ticketData) => {
  const response = await api.post('/tickets/book', ticketData);
  return response.data;
};

// Fetch all tickets for the logged-in user
export const getMyTickets = async () => {
  const response = await api.get('/tickets/my');
  return response.data;
};

// Fetch ticket details by ticket ID
export const getTicketById = async (id) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};
