import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllApplications, updateApplicationStatus, deleteApplication } from '../../redux/slices/applicationSlice';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const ApplicationsManagement = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.application);

  useEffect(() => {
    dispatch(getAllApplications());
  }, [dispatch]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await dispatch(updateApplicationStatus({ id: applicationId, status: newStatus })).unwrap();
      toast.success('Application status updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update application status');
    }
  };

  const handleDelete = async (applicationId) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await dispatch(deleteApplication(applicationId)).unwrap();
        toast.success('Application deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete application');
      }
    }
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Applications Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {application.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Age: {application.age} | Gender: {application.gender}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.contact}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      application.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : application.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(application._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash className="inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsManagement; 