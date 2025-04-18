import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createBooking, reset } from '../../redux/slices/bookingSlice';
import { getFutsalCourtById } from '../../redux/slices/futsalCourtSlice';
import EsewaPayment from '../payment/EsewaPayment';
import { toast } from 'react-toastify';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { court, loading: courtLoading } = useSelector((state) => state.futsalCourt);
  const { loading, error, success, booking } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    notes: '',
  });

  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    dispatch(getFutsalCourtById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success && booking) {
      setShowPayment(true);
    }
  }, [success, booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createBooking({ ...formData, futsalCourt: id })).unwrap();
      toast.success('Book Confirmed! ');
      setShowPayment(true);
    } catch (error) {
      toast.error(error.message || 'Failed to create booking');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (courtLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="text-center text-red-600 py-8">
        Futsal court not found.
      </div>
    );
  }

  if (showPayment && booking) {
    return <EsewaPayment bookingId={booking._id} amount={booking.totalPrice} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-4xl font-bold mb-8 text-gray-800 text-center">Book {court.name}</h2>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <div className="relative rounded-xl overflow-hidden mb-6">
            <img
              src={court.image}
              alt={court.name}
              className="w-full h-72 object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-medium shadow-md">
                Rs {court.pricePerHour}/hour
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 text-lg">{court.description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-lg">Type: {court.type}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg">Operating Hours: {court.openingTime} - {court.closingTime}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2">Booking Date</label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-lg font-medium mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                min={court.openingTime}
                max={court.closingTime}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-lg font-medium mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                min={formData.startTime || court.openingTime}
                max={court.closingTime}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Add any special requests or notes here..."
            ></textarea>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400 text-lg font-medium shadow-md hover:shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 