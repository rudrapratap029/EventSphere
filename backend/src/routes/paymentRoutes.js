import express from 'express';
import {
  createPaymentOrder,
  verifyPaymentAndCreateTicket,
  getRazorpayKey
} from '../controllers/paymentController.js';
import { protect, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Retrieve configured Razorpay Key ID
router.get('/key', getRazorpayKey);

// Create Razorpay Order (Protected - Role: user)
router.post('/create-order', protect, roleMiddleware('user'), createPaymentOrder);

// Verify payment signature and generate confirmed ticket (Protected - Role: user)
router.post('/verify', protect, roleMiddleware('user'), verifyPaymentAndCreateTicket);

export default router;
