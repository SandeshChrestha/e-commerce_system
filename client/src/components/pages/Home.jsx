import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [imageLoading, setImageLoading] = useState({});

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  // Category data with Cloudinary images
  const categories = [
    {
      name: 'Futsal Shoes',
      slug: 'shoes',
      image: 'https://res.cloudinary.com/db0styhyf/image/upload/v1743503529/shoes_rcjwy4.jpg',
      description: 'High-quality futsal shoes for optimal performance',
      fallbackImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="%23e5e7eb"%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%236b7280"%3EFutsal Shoes%3C/text%3E%3C/svg%3E'
    },
    {
      name: 'Futsal Balls',
      slug: 'balls',
      image: 'https://res.cloudinary.com/db0styhyf/image/upload/v1743503529/ball_kwrqe4.jpg',
      description: 'Professional futsal balls for the perfect game',
      fallbackImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="%23e5e7eb"%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%236b7280"%3EFutsal Balls%3C/text%3E%3C/svg%3E'
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      image: 'https://res.cloudinary.com/db0styhyf/image/upload/v1743503530/accessories_bdgrpo.jpg',
      description: 'Essential accessories for futsal players',
      fallbackImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="%23e5e7eb"%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%236b7280"%3EAccessories%3C/text%3E%3C/svg%3E'
    }
  ];

  const handleImageLoad = (slug) => {
    setImageLoading(prev => ({ ...prev, [slug]: false }));
  };

  const handleImageError = (e, category) => {
    e.target.src = category.fallbackImage;
    setImageLoading(prev => ({ ...prev, [category.slug]: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/db0styhyf/image/upload/v1743502712/american-football-american-football-player-professional-sport-stadium_wpknj0.jpg"
            alt="Futsal Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Welcome to Sport Hub
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Your one-stop destination for all futsal equipment and accessories .
            
          </p>
          <div className="mt-10">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-64">
                {imageLoading[category.slug] !== false && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
                <img
                  src={category.image}
                  alt={category.name}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    imageLoading[category.slug] !== false ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => handleImageLoad(category.slug)}
                  onError={(e) => handleImageError(e, category)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-blue-600">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 