import express from 'express';
import {
  registerOrganizer,
  loginOrganizer,
  getOrganizerProfile,
  updateOrganizerProfile,
  getOrganizerDashboard,
  getOrganizerEvents,
  createOrganizerEvent,
  updateOrganizerEvent,
  deleteOrganizerEvent,
  getPublicOrganizerById
} from '../controllers/organizerController.js';
import { protectOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth routes
router.post('/register', registerOrganizer);
router.post('/login', loginOrganizer);

// Protected organizer profile routes
router.route('/profile')
  .get(protectOrganizer, getOrganizerProfile)
  .put(protectOrganizer, updateOrganizerProfile);

// Protected organizer dashboard & analytics
router.get('/dashboard', protectOrganizer, getOrganizerDashboard);

// Protected organizer events management
router.route('/events')
  .get(protectOrganizer, getOrganizerEvents)
  .post(protectOrganizer, createOrganizerEvent);

router.route('/events/:id')
  .put(protectOrganizer, updateOrganizerEvent)
  .delete(protectOrganizer, deleteOrganizerEvent);

// Public organizer profile by ID
router.get('/:id', getPublicOrganizerById);

export default router;
