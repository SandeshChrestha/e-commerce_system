import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems = [] } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Futsal Store</span>
            </Link>
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
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-gray-600 hover:text-gray-900 text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <>
                {user.isAdmin && (
                  <div className="relative group">
                    <Link to="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
                      <FaCog className="text-xl mr-1" />
                      Admin
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
      </div>
    </nav>
  );
};

export default Navbar; 