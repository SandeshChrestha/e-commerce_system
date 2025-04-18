import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
  fetchCourts,
  deleteFutsalCourt,
} from '../../redux/slices/futsalCourtSlice';
import { toast } from 'react-toastify';

const AdminCourtList = () => {
  const dispatch = useDispatch();
  const { courts = [], loading, error } = useSelector((state) => state.futsalCourt);

  useEffect(() => {
    dispatch(fetchCourts());
  }, [dispatch]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await dispatch(deleteFutsalCourt(id)).unwrap();
        toast.success('Court deleted successfully');
      } catch (err) {
        toast.error(err || 'Failed to delete court');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Ensure courts is an array
  const courtsArray = Array.isArray(courts) ? courts : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Futsal Courts</h1>
        <Link
          to="/admin/courts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Court
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {courtsArray.length > 0 ? (
            courtsArray.map((court) => (
              <li key={court._id}>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{court.name}</h3>
                      <p className="text-sm text-gray-500">Type: {court.type}</p>
                      <p className="text-sm text-gray-500">Price: Rs {court.pricePerHour}/hour</p>
                      <p className="text-sm text-gray-500">
                        Operating Hours: {court.openingTime} - {court.closingTime}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/admin/courts/${court._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(court._id, court.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-4 text-center text-gray-500">
              No courts available. Add a new court to get started.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminCourtList; 