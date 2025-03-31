import React from 'react';
import PropTypes from 'prop-types';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded"
      />

      <div className="flex-1 ml-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
        <p className="text-gray-600">Rs {item.price}</p>
      </div>

      <div className="flex items-center space-x-4">
        <select
          value={item.quantity}
          onChange={(e) => onQuantityChange(item._id, Number(e.target.value))}
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {[...Array(item.countInStock).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </select>

        <button
          onClick={() => onRemove(item._id)}
          className="text-red-600 hover:text-red-800 focus:outline-none"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="ml-4 text-right">
        <p className="text-lg font-semibold text-gray-900">
          Rs {(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    countInStock: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem; 