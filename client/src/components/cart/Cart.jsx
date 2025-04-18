import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const handleRemoveFromCart = (itemId, itemName) => {
    dispatch(removeFromCart(itemId));
    toast.success(`${itemName} removed from cart`);
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ _id: item._id, quantity: newQuantity }));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to see them here.</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item._id} className="p-6 flex items-center">
                <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%236b7280'%3E${item.name}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-lg font-medium text-blue-600">Rs {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-gray-600 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item._id, item.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-xl font-medium text-gray-900">Total</p>
              <p className="text-2xl font-bold text-blue-600">Rs {calculateTotal()}</p>
            </div>
            <div className="mt-6">
              <Link
                to="/checkout"
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 