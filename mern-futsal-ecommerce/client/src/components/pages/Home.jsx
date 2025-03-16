import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Ultimate Futsal Equipment Store
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Get premium quality futsal gear at competitive prices. Shop our wide selection of shoes, balls, and accessories.
              </p>
              <Link
                to="/products"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
              >
                Shop Now
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-4 rounded-lg shadow-xl">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' fill='none'%3E%3Cpath d='M400 100L600 300L400 500L200 300L400 100Z' fill='%232563EB' /%3E%3C/svg%3E"
                  alt="Futsal Equipment"
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shoes Category */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Futsal Shoes</h3>
                <p className="text-gray-600 mb-4">
                  Professional grade futsal shoes for better control and comfort
                </p>
                <Link
                  to="/products?category=shoes"
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Browse Shoes →
                </Link>
              </div>
            </div>

            {/* Balls Category */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Futsal Balls</h3>
                <p className="text-gray-600 mb-4">
                  High-quality futsal balls for training and matches
                </p>
                <Link
                  to="/products?category=balls"
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Browse Balls →
                </Link>
              </div>
            </div>

            {/* Accessories Category */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Accessories</h3>
                <p className="text-gray-600 mb-4">
                  Essential accessories for your futsal game
                </p>
                <Link
                  to="/products?category=accessories"
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Browse Accessories →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Quality */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only the best products from trusted brands</p>
            </div>

            {/* Fast Shipping */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Quick delivery to your doorstep</p>
            </div>

            {/* Support */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Always here to help you</p>
            </div>

            {/* Returns */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-8">
              Subscribe to our newsletter for the latest products and futsal news
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-lg text-gray-900 flex-1 max-w-md"
              />
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 