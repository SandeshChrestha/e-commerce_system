import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductDetails } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../../redux/slices/favoriteSlice';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const { items: favorites } = useSelector((state) => state.favorite);
  const isFavorite = favorites.some(item => item._id === id);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        image: product.imageUrl,
        price: product.price,
        countInStock: product.countInStock,
        quantity,
      })
    );
    navigate('/cart');
  };

  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isFavorite) {
      dispatch(removeFromFavorites(product._id));
      toast.info('Removed from favorites');
    } else {
      dispatch(addToFavorites({
        _id: product._id,
        name: product.name,
        image: product.imageUrl,
        price: product.price,
        description: product.description,
        brand: product.brand,
      }));
      toast.success('Added to favorites');
    }
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
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />
            {user && (
              <button
                onClick={handleToggleFavorite}
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md"
              >
                {isFavorite ? 
                  <FaHeart className="text-red-500 text-xl" /> : 
                  <FaRegHeart className="text-gray-500 text-xl" />
                }
              </button>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">
              {product.description}
            </p>
            <div className="mb-6">
              <span className="text-3xl font-bold text-blue-600">
                ${product.price}
              </span>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <select
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Select Size</option>
                <option>US 7</option>
                <option>US 8</option>
                <option>US 9</option>
                <option>US 10</option>
                <option>US 11</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-24 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  product.countInStock === 0 ? 'cursor-not-allowed opacity-60' : ''
                }`}
              >
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              {user && (
                <button
                  onClick={handleToggleFavorite}
                  className={`w-full py-3 px-6 rounded-md flex justify-center items-center ${
                    isFavorite 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isFavorite ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 