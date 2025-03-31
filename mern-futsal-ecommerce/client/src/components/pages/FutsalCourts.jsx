import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCourts } from '../../redux/slices/futsalCourtSlice';

const FutsalCourts = () => {
  const dispatch = useDispatch();
  const { courts, loading, error } = useSelector((state) => state.futsalCourt);

  useEffect(() => {
    dispatch(fetchCourts());
  }, [dispatch]);

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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Futsal Courts</h1>
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