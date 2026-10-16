import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  bookEventTickets
} from '../controllers/eventController.js';
import { protectOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public read, Organizer-only create
router.route('/')
  .post(protectOrganizer, createEvent)
  .get(getAllEvents);

// Public read, Organizer-only edit & delete
router.route('/:id')
  .get(getEventById)
  .put(protectOrganizer, updateEvent)
  .delete(protectOrganizer, deleteEvent);

// Ticket reservation endpoint for visitors/attendees
router.post('/:id/book', bookEventTickets);

export default router;
