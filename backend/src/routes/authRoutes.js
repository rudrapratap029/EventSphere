import express from 'express';
import {
  registerUser,
  loginUser,
  registerOrganizer,
  loginOrganizer,
  getCurrentUser,
  updateCurrentUser,
  logout,
  refreshAccessToken
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// User auth
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

// Organizer auth
router.post('/organizer/register', registerOrganizer);
router.post('/organizer/login', loginOrganizer);

// Common auth endpoints
router.route('/me')
  .get(authMiddleware, getCurrentUser)
  .put(authMiddleware, updateCurrentUser);
router.post('/logout', authMiddleware, logout);
router.post('/refresh', refreshAccessToken);

export default router;
