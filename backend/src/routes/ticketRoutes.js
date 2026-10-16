import express from 'express';
import {
  bookTicket,
  getMyTickets,
  getTicketById
} from '../controllers/ticketController.js';
import { protect, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Booking route: user role only
router.post('/book', protect, roleMiddleware('user'), bookTicket);
router.post('/', protect, roleMiddleware('user'), bookTicket);

// List user's booked tickets
router.get('/my', protect, roleMiddleware('user'), getMyTickets);

// Single ticket details: Protected with strict owner verification
router.get('/:id', protect, getTicketById);

export default router;
