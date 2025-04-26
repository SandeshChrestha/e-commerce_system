import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBox, FaFutbol, FaCalendarAlt, FaShoppingBag, FaUsers } from 'react-icons/fa';

const AdminDashboard = () => {
  const { products } = useSelector((state) => state.product);
  const { users } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);

  const stats = {
    totalProducts: products?.length || 0,
    totalUsers: users?.length || 0,
    totalOrders: orders?.length || 0,
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
            <p className="text-3xl font-bold text-purple-600">{stats.totalOrders}</p>
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
                to="/admin/products/create"
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

        {/* Order Management */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Management</h2>
          <div className="space-y-4">
            <Link
              to="/admin/orders"
              className="block bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg transition-colors"
            >
              <h3 className="text-lg font-medium text-yellow-700">View All Orders</h3>
              <p className="text-yellow-600">Manage and track all orders</p>
            </Link>
          </div>
        </div>

        {/* Courts Management */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Courts Management</h2>
          <div className="space-y-4">
            <Link
              to="/admin/courts"
              className="block bg-green-50 hover:bg-green-100 p-4 rounded-lg transition-colors"
            >
              <h3 className="text-lg font-medium text-green-700">Manage Futsal Courts</h3>
              <p className="text-green-600">Add, edit, and delete futsal courts</p>
            </Link>
          </div>
        </div>

        {/* Bookings Overview */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Bookings</h2>
          <div className="space-y-4">
            <Link
              to="/admin/bookings"
              className="block bg-purple-50 hover:bg-purple-100 p-4 rounded-lg transition-colors"
            >
              <h3 className="text-lg font-medium text-purple-700">View All Bookings</h3>
              <p className="text-purple-600">View and manage court bookings</p>
            </Link>
          </div>
        </div>

        {/* Applications Overview */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Applications</h2>
          <div className="space-y-4">
            <Link
              to="/admin/applications"
              className="block bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors"
            >
              <h3 className="text-lg font-medium text-blue-700">View All Applications</h3>
              <p className="text-blue-600">View and manage job applications</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 