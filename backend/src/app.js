import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running and healthy!',
    timestamp: new Date().toISOString()
  });
});

// Module Routes
app.use('/api/events', eventRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
