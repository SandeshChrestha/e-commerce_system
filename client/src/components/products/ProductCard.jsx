import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../../redux/slices/favoriteSlice';
import { toast } from 'react-toastify';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items: favorites } = useSelector((state) => state.favorite);
  const isFavorite = favorites.some(item => item._id === product._id);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success('Product added to cart!');
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorites(product._id));
      toast.info('Removed from favorites');
    } else {
      dispatch(addToFavorites(product));
      toast.success('Added to favorites');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-64">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%236b7280'%3E${product.name}%3C/text%3E%3C/svg%3E`;
          }}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
            Rs {product.price}
          </span>
        </div>
        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md text-lg"
        >
          {isFavorite ? 
            <FaHeart className="text-red-500" /> : 
            <FaRegHeart className="text-gray-500" />
          }
        </button>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {product.description}
        </p>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{product.brand}</span>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Add to Cart
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`w-full px-4 py-2.5 rounded-lg transition-colors duration-300 font-medium ${
                isFavorite
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 