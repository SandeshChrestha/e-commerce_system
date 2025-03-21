import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createCourt, updateCourt, fetchCourts } from '../../redux/slices/futsalCourtSlice';
import { toast } from 'react-toastify';

const AdminCourtForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { courts, loading, error } = useSelector((state) => state.futsalCourt);
  const { user } = useSelector((state) => state.auth);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      toast.error('You must be logged in as an admin to access this page');
      navigate('/login');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Indoor',
    pricePerHour: '',
    description: '',
    facilities: '',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    },
    openingTime: '06:00',
    closingTime: '22:00',
  });

  useEffect(() => {
    if (id) {
      const court = courts.find(c => c._id === id);
      if (court) {
        setFormData({
          name: court.name,
          type: court.type,
          pricePerHour: court.pricePerHour,
          description: court.description || '',
          facilities: Array.isArray(court.facilities) ? court.facilities.join(', ') : '',
          availability: court.availability || {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
          },
          openingTime: court.openingTime || '06:00',
          closingTime: court.closingTime || '22:00',
        });
      } else {
        dispatch(fetchCourts());
      }
    }
  }, [id, courts, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('availability.')) {
      const day = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [day]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.isAdmin) {
      toast.error('You must be logged in as an admin to perform this action');
      return;
    }

    try {
      // Convert facilities string to array
      const facilitiesArray = formData.facilities
        ? formData.facilities.split(',').map(item => item.trim())
        : [];

      // Convert availability object to array of days
      const availableDays = Object.entries(formData.availability)
        .filter(([_, isAvailable]) => isAvailable)
        .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));

      const courtData = {
        name: formData.name,
        type: formData.type,
        pricePerHour: Number(formData.pricePerHour),
        description: formData.description,
        facilities: facilitiesArray,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        availableDays: availableDays,
      };

      if (id) {
        await dispatch(updateCourt({ id, courtData })).unwrap();
        toast.success('Court updated successfully');
      } else {
        await dispatch(createCourt(courtData)).unwrap();
        toast.success('Court created successfully');
      }
      navigate('/admin/courts');
    } catch (err) {
      toast.error(err || 'Failed to save court');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {id ? 'Edit Court' : 'Add New Court'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Court Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price per Hour ($)
            </label>
            <input
              type="number"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Facilities
            </label>
            <input
              type="text"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="e.g., Changing rooms, Showers, Parking"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Operating Hours
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">Opening Time</label>
                <input
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Closing Time</label>
                <input
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Available Days
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.keys(formData.availability).map((day) => (
                <label key={day} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name={`availability.${day}`}
                    checked={formData.availability[day]}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 capitalize">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/courts')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {id ? 'Update Court' : 'Create Court'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminCourtForm; 