import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchAllOrders, deleteOrder, updateOrderStatus } from '../../redux/slices/orderSlice';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const [editingOrder, setEditingOrder] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
        dispatch(fetchAllOrders());
        toast.success('Order deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete order');
      }
    }
  };

  const handleStatusChange = (orderId, currentStatus) => {
    setEditingOrder(orderId);
    setStatus(currentStatus);
  };

  const handleStatusUpdate = async (orderId) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      setEditingOrder(null);
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-3 px-4">{order._id}</td>
                <td className="py-3 px-4">{order.user?.name}</td>
                <td className="py-3 px-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">Rs {order.totalPrice.toFixed(2)}</td>
                <td className="py-3 px-4">
                  {editingOrder === order._id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleStatusUpdate(order._id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingOrder(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      <button
                        onClick={() => handleStatusChange(order._id, order.status)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
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

export default AdminOrders; 