import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../redux/slices/bookingSlice';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {bookings && bookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow rounded-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {booking.futsalCourt?.name || 'Court Name Not Available'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Date: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Time: {booking.startTime} - {booking.endTime}
                  </p>
                  {booking.notes && (
                    <p className="text-gray-600 mt-2">Notes: {booking.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  <p className="text-gray-900 font-medium mt-2">
                    Rs {booking.totalPrice}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You haven't made any bookings yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyBookings; 