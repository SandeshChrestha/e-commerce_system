import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCog, FaHeart } from 'react-icons/fa';
import ApplicationForm from '../application/ApplicationForm';
import { redirectBasedOnRole } from '../../utils/authUtils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.cart);
  const { items: favorites = [] } = useSelector((state) => state.favorite);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (user) {
      redirectBasedOnRole(user, navigate);
    } else {
      navigate('/');
    }
  };

  const isAdmin = user?.isAdmin;

  return (
    <>
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div onClick={handleLogoClick} className="flex items-center cursor-pointer">
                <span className="text-xl font-bold text-blue-600">Futsal Shop</span>
              </div>

              {/* Regular user nav links (hidden for admin) */}
              {!isAdmin && (
                <div className="hidden md:flex items-center space-x-4 ml-10">
                  <Link to="/products" className="text-gray-600 hover:text-gray-900">
                    Products
                  </Link>
                  <Link to="/futsal-courts" className="text-gray-600 hover:text-gray-900">
                    Futsal Courts
                  </Link>
                  {user && (
                    <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                      Profile
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Apply button (hidden for admin) */}
              {user && !isAdmin && (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Apply
                </button>
              )}

              {/* Favorites (hidden for admin) */}
              {!isAdmin && user && (
                <Link to="/favorites" className="relative">
                  <FaHeart className="text-gray-600 hover:text-gray-900 text-xl" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart (hidden for admin) */}
              {!isAdmin && (
                <Link to="/cart" className="relative">
                  <FaShoppingCart className="text-gray-600 hover:text-gray-900 text-xl" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              )}

              {/* Authenticated user */}
              {user ? (
                <>
                  {/* Admin dashboard dropdown */}
                  {isAdmin && (
                    <div className="relative group">
                      <Link to="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
                        <FaCog className="text-xl mr-1" />
                        Dashboard
                      </Link>
                      <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl z-20 hidden group-hover:block">
                        <Link
                          to="/admin/products"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Products
                        </Link>
                        <Link
                          to="/admin/courts"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Courts
                        </Link>
                        <Link
                          to="/admin/bookings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Bookings
                        </Link>
                        <Link
                          to="/admin/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Manage Orders
                        </Link>
                        <Link
                          to="/admin/applications"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Applications
                        </Link>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <FaSignOutAlt className="text-xl mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center text-gray-600 hover:text-gray-900">
                  <FaUser className="text-xl mr-1" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <ApplicationForm onClose={() => setShowApplicationForm(false)} />
      )}
    </>
  );
};

export default Navbar;
