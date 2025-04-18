import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.route('/').post(protect, createBooking);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/cancel').put(protect, cancelBooking);

// Admin routes
router.route('/').get(protect, admin, getAllBookings);
router.route('/:id').put(protect, admin, updateBookingStatus);
router.route('/:id').delete(protect, admin, deleteBooking);

export default router; 