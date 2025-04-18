import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchCourts, createBooking } from '../../redux/slices/futsalCourtSlice';

const Booking = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');

  const { courts = [], loading, error } = useSelector((state) => state.futsalCourt);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCourts());
  }, [dispatch]);

  // Available time slots (you can modify these)
  const timeSlots = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
    '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
  ];

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book a court');
      return;
    }

    if (!selectedCourt || !selectedTime) {
      toast.error('Please select both court and time');
      return;
    }

    try {
      const bookingData = {
        courtId: selectedCourt,
        date: selectedDate,
        timeSlot: selectedTime,
      };

      await dispatch(createBooking(bookingData)).unwrap();
      toast.success('Booking created successfully!');
      
      // Reset form
      setSelectedCourt('');
      setSelectedTime('');
    } catch (err) {
      toast.error(err || 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Book a Futsal Court
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Court Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Courts</h2>
              <div className="grid grid-cols-1 gap-4">
                {courts.map((court) => (
                  <div
                    key={court._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedCourt === court._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedCourt(court._id)}
                  >
                    <h3 className="font-medium">{court.name}</h3>
                    <p className="text-gray-600">Type: {court.type}</p>
                    <p className="text-blue-600 font-medium">
                      Rs {court.pricePerHour}/hour
                    </p>
                    <p className="text-sm text-gray-500">
                      Operating Hours: {court.openingTime} - {court.closingTime}
                    </p>
                    {court.facilities && court.facilities.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Facilities: {court.facilities.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date()}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        className={`p-2 text-sm rounded-md ${
                          selectedTime === time
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors mt-6"
                  disabled={!selectedCourt || !selectedTime}
                >
                  {user ? 'Book Now' : 'Login to Book'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              • Bookings can be made up to 7 days in advance
            </p>
            <p className="text-gray-600">
              • Payment must be made at least 24 hours before the booking time
            </p>
            <p className="text-gray-600">
              • Cancellations made 24 hours before the booking time will receive a full refund
            </p>
            <p className="text-gray-600">
              • Please arrive 15 minutes before your booking time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking; 