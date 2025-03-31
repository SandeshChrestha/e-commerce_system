import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createBooking, reset } from '../../redux/slices/bookingSlice';
import { getFutsalCourtById } from '../../redux/slices/futsalCourtSlice';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { court, loading: courtLoading } = useSelector((state) => state.futsalCourt);
  const { loading, error, success } = useSelector((state) => state.booking);

  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(getFutsalCourtById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      navigate('/my-bookings');
    }
  }, [success, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createBooking({ ...formData, futsalCourt: id }));
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Book {court.name}</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <img
            src={court.image}
            alt={court.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-600 mb-2">{court.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Type: {court.type}</span>
            <span className="text-green-600 font-semibold">
              Rs {court.pricePerHour}/hour
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Booking Date</label>
            <input
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                min={court.openingTime}
                max={court.closingTime}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                min={formData.startTime || court.openingTime}
                max={court.closingTime}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 