import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromFavorites, clearFavorites } from '../../redux/slices/favoriteSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Favorites = () => {
  const dispatch = useDispatch();
  const { items: favorites } = useSelector((state) => state.favorite);

  const handleRemoveFromFavorites = (productId) => {
    dispatch(removeFromFavorites(productId));
    toast.info('Removed from favorites');
  };

  const handleClearFavorites = () => {
    dispatch(clearFavorites());
    toast.info('Favorites cleared');
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success('Added to cart');
  };

  if (favorites.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg mb-6">You don't have any favorite products yet.</p>
          <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <button 
          onClick={handleClearFavorites}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map(product => (
          <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-64">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%236b7280'%3E${product.name}%3C/text%3E%3C/svg%3E`;
                }}
              />
              <div className="absolute top-4 right-4">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                  Rs {product.price}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                {product.name}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                {product.description}
              </p>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{product.brand}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center justify-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromFavorites(product._id)}
                    className="flex items-center justify-center bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FaTrash className="mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites; 