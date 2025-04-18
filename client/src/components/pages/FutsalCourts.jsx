import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCourts } from '../../redux/slices/futsalCourtSlice';
import { fetchBookings } from '../../redux/slices/futsalCourtSlice';

const FutsalCourts = () => {
  const dispatch = useDispatch();
  const { courts, loading, error } = useSelector((state) => state.futsalCourt);
  const { user } = useSelector((state) => state.auth);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    dispatch(fetchCourts());
  }, [dispatch]);

  const handleBookingHistory = async () => {
    if (!user) {
      alert('Please login to view booking history');
      return;
    }
    try {
      const result = await dispatch(fetchBookings()).unwrap();
      setBookings(result);
      setShowBookingHistory(true);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error loading futsal courts. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Futsal Courts</h1>
        <button
          onClick={handleBookingHistory}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
        >
          Booking History
        </button>
      </div>

      {/* Booking History Modal */}
      {showBookingHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Booking History</h2>
              <button
                onClick={() => setShowBookingHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {bookings.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No bookings found</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.futsalCourt?.name}</h3>
                        <p className="text-gray-600">
                          Date: {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600">
                          Time: {booking.startTime} - {booking.endTime}
                        </p>
                        <p className="text-gray-600">Price: Rs {booking.totalPrice}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <div
            key={court._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={court.image}
              alt={court.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{court.name}</h3>
              <p className="text-gray-600 mb-2">{court.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Type: {court.type}</span>
                <span className="text-green-600 font-semibold">
                  Rs {court.pricePerHour}/hour
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {court.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {facility}
                  </span>
                ))}
              </div>
              <Link
                to={`/booking/${court._id}`}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FutsalCourts; 