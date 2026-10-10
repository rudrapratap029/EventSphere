import express from 'express';
import {
  registerUser,
  loginUser,
  registerOrganizer,
  loginOrganizer,
  getCurrentUser,
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
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logout);
router.post('/refresh', refreshAccessToken);

export default router;
