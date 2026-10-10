import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { seedDatabaseIfEmpty } from './utils/seedEvents.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDB();

// Auto-seed if database has no events
await seedDatabaseIfEmpty();

const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
