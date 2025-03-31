import asyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import FutsalCourt from '../models/futsalCourtModel.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { futsalCourt, bookingDate, startTime, endTime, notes } = req.body;

  // Check if the court exists
  const court = await FutsalCourt.findById(futsalCourt);
  if (!court) {
    res.status(404);
    throw new Error('Futsal court not found');
  }

  // Check if the time slot is available
  const existingBooking = await Booking.findOne({
    futsalCourt,
    bookingDate,
    $or: [
      {
        startTime: { $lte: startTime },
        endTime: { $gt: startTime },
      },
      {
        startTime: { $lt: endTime },
        endTime: { $gte: endTime },
      },
    ],
    status: { $ne: 'cancelled' },
  });

  if (existingBooking) {
    res.status(400);
    throw new Error('This time slot is already booked');
  }

  // Calculate total price
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = parseInt(endTime.split(':')[0]);
  const hours = endHour - startHour;
  const totalPrice = court.pricePerHour * hours;

  const booking = await Booking.create({
    user: req.user._id,
    futsalCourt,
    bookingDate,
    startTime,
    endTime,
    totalPrice,
    notes,
  });

  res.status(201).json(booking);
});

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('user', 'name email')
    .populate('futsalCourt', 'name type pricePerHour');
  res.json(bookings);
});

// @desc    Get user's bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('futsalCourt', 'name type pricePerHour');
  res.json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('futsalCourt', 'name type pricePerHour');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized to view this booking
  if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to view this booking');
  }

  res.json(booking);
});

// @desc    Update booking status (admin only)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  booking.status = req.body.status || booking.status;
  booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;
  booking.notes = req.body.notes || booking.notes;

  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user is authorized to cancel this booking
  if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to cancel this booking');
  }

  booking.status = 'cancelled';
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

// @desc    Delete booking (admin only)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  await booking.remove();
  res.json({ message: 'Booking removed' });
});

export {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
}; 