import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const { products } = useSelector((state) => state.product);
  const { users } = useSelector((state) => state.user);

  const stats = {
    totalProducts: products?.length || 0,
    totalUsers: users?.length || 0,
    // Add more stats as needed
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Products</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Users</h2>
            <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Orders</h2>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Management</h2>
            <div className="space-y-4">
              <Link
                to="/admin/products"
                className="block bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors"
              >
                <h3 className="text-lg font-medium text-blue-700">View All Products</h3>
                <p className="text-blue-600">Manage your product inventory</p>
              </Link>
              <Link
                to="/admin/products/new"
                className="block bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors"
              >
                <h3 className="text-lg font-medium text-green-700">Add New Product</h3>
                <p className="text-green-600">Create a new product listing</p>
              </Link>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">User Management</h2>
            <div className="space-y-4">
              <Link
                to="/admin/users"
                className="block bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition-colors"
              >
                <h3 className="text-lg font-medium text-purple-700">View All Users</h3>
                <p className="text-purple-600">Manage user accounts</p>
              </Link>
              <Link
                to="/admin/users/new"
                className="block bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg transition-colors"
              >
                <h3 className="text-lg font-medium text-indigo-700">Add New User</h3>
                <p className="text-indigo-600">Create a new user account</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 