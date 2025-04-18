import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import colors from 'colors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import connectDB from './config/db.js';
import mongoose from 'mongoose';

// Import routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import futsalCourtRoutes from './routes/futsalCourtRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/futsal-courts', futsalCourtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/applications', applicationRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Test route for environment variables
app.get('/api/config', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    mongoDBConnected: mongoose.connection.readyState === 1,
    uploadPath: process.env.UPLOAD_PATH,
    maxFileSize: process.env.MAX_FILE_SIZE
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
}); 