import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import {
  createFutsalCourt,
  updateFutsalCourt,
  deleteFutsalCourt,
  fetchCourts,
} from '../../redux/slices/futsalCourtSlice';

const CourtsManagement = () => {
  const dispatch = useDispatch();
  const { courts, loading, error } = useSelector((state) => state.futsalCourt);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'indoor',
    pricePerHour: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    dispatch(fetchCourts());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCourt) {
        await dispatch(updateFutsalCourt({ id: selectedCourt._id, ...formData })).unwrap();
        toast.success('Court updated successfully');
      } else {
        await dispatch(createFutsalCourt(formData)).unwrap();
        toast.success('Court added successfully');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Failed to save court');
    }
  };

  const handleDelete = async (courtId) => {
    if (window.confirm('Are you sure you want to delete this court?')) {
      try {
        await dispatch(deleteFutsalCourt(courtId)).unwrap();
        toast.success('Court deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete court');
      }
    }
  };

  const openModal = (court = null) => {
    if (court) {
      setSelectedCourt(court);
      setFormData({
        name: court.name,
        type: court.type,
        pricePerHour: court.pricePerHour,
        description: court.description,
        image: court.image,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCourt(null);
    setFormData({
      name: '',
      type: 'indoor',
      pricePerHour: '',
      description: '',
      image: '',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Futsal Courts</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
        >
          <FaPlus className="mr-2" />
          Add New Court
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courts.map((court) => (
          <div key={court._id} className="bg-white rounded-lg shadow overflow-hidden">
            {court.image && (
              <img
                src={court.image}
                alt={court.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{court.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{court.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Type: {court.type.charAt(0).toUpperCase() + court.type.slice(1)}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  Rs {court.pricePerHour}/hour
                </span>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => openModal(court)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FaEdit className="inline-block" />
                </button>
                <button
                  onClick={() => handleDelete(court._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash className="inline-block" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Court Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedCourt ? 'Edit Court' : 'Add New Court'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price per Hour
                  </label>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {selectedCourt ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtsManagement; 