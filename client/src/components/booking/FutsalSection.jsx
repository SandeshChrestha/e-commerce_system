import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCourts } from '../../redux/slices/futsalCourtSlice';

const FutsalSection = () => {
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
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Available Futsal Courts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courts.map((court) => (
            <div
              key={court._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={court.image}
                  alt={court.name}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                    Rs {court.pricePerHour}/hour
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{court.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{court.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Type: {court.type}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Hours: {court.openingTime} - {court.closingTime}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {court.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {facility}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/booking/${court._id}`}
                  className="mt-6 block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FutsalSection; 