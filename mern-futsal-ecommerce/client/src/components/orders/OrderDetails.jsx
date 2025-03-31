import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOrderDetails, updateOrderToDelivered } from '../../redux/slices/orderSlice';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const handleMarkAsDelivered = () => {
    dispatch(updateOrderToDelivered(id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Order #{order._id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping Information
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {order.user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.user.email}
              </p>
              <p>
                <span className="font-medium">Address:</span>{' '}
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span
                  className={`${
                    order.isDelivered
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Payment Information
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Method:</span>{' '}
                {order.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span
                  className={`${
                    order.isPaid ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {order.isPaid ? 'Paid' : 'Not Paid'}
                </span>
              </p>
              {order.isPaid && (
                <p>
                  <span className="font-medium">Paid At:</span>{' '}
                  {new Date(order.paidAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center border-b border-gray-200 py-4 last:border-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-gray-600">
                      {item.quantity} x Rs {item.price} = Rs
                      {(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Items Price:</span>
                  <span>Rs {order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span>Rs {order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span>Rs {order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {user?.isAdmin && !order.isDelivered && (
            <button
              onClick={handleMarkAsDelivered}
              className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 