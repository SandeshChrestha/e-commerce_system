import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createFutsalCourt,
  updateFutsalCourt,
  getFutsalCourtById,
} from '../../redux/slices/futsalCourtSlice';
import { toast } from 'react-toastify';

const AdminCourtForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { court, loading, error } = useSelector((state) => state.futsalCourt);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Indoor',
    pricePerHour: '',
    description: '',
    image: '',
    openingTime: '',
    closingTime: '',
    facilities: [],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getFutsalCourtById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (court) {
      setFormData({
        name: court.name,
        type: court.type,
        pricePerHour: court.pricePerHour,
        description: court.description,
        image: court.image,
        openingTime: court.openingTime,
        closingTime: court.closingTime,
        facilities: court.facilities || [],
        availableDays: court.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      });
      setImagePreview(court.image);
    }
  }, [court]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await dispatch(updateFutsalCourt({ id, ...formData })).unwrap();
        toast.success('Court updated successfully');
      } else {
        await dispatch(createFutsalCourt(formData)).unwrap();
        toast.success('Court created successfully');
      }
      navigate('/admin/courts');
    } catch (err) {
      toast.error(err || 'Failed to save court');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const day = name;
      setFormData(prev => ({
        ...prev,
        availableDays: checked
          ? [...prev.availableDays, day]
          : prev.availableDays.filter(d => d !== day)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFacilitiesChange = (e) => {
    const facilities = e.target.value.split(',').map(facility => facility.trim());
    setFormData(prev => ({ ...prev, facilities }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {id ? 'Edit Court' : 'Add New Court'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
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
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Premium">Premium</option>
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
            Facilities (comma-separated)
          </label>
          <input
            type="text"
            name="facilities"
            value={formData.facilities.join(', ')}
            onChange={handleFacilitiesChange}
            placeholder="e.g., Changing rooms, Showers, Parking"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Court Image
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <div className="flex-shrink-0">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Court preview"
                  className="h-32 w-32 object-cover rounded-lg"
                />
              ) : (
                <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Upload a high-quality image of the court (JPG, PNG, GIF)
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Opening Time
          </label>
          <input
            type="time"
            name="openingTime"
            value={formData.openingTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Closing Time
          </label>
          <input
            type="time"
            name="closingTime"
            value={formData.closingTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Days
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <label key={day} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name={day}
                  checked={formData.availableDays.includes(day)}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/courts')}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {id ? 'Update Court' : 'Add Court'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCourtForm; 