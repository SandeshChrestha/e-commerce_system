import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';


// Product Components
import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import Home from './components/pages/Home';
import FutsalCourts from './components/pages/FutsalCourts';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import Favorites from './components/favorites/Favorites';

// Payment Components
import PaymentSuccess from './components/payment/PaymentSuccess';

// Booking Components
import BookingForm from './components/booking/BookingForm';
import BookingsManagement from './components/admin/BookingsManagement';
import MyBookings from './components/booking/MyBookings';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProductList from './components/admin/AdminProductList';
import AdminProductForm from './components/admin/AdminProductForm';
import AdminOrderList from './components/admin/AdminOrderList';
import AdminUserList from './components/admin/AdminUserList';
import AdminCourtList from './components/admin/AdminCourtList';
import AdminCourtForm from './components/admin/AdminCourtForm';
import CourtsManagement from './components/admin/CourtsManagement';
import AdminOrders from './components/admin/AdminOrders';
import ApplicationsManagement from './components/admin/ApplicationsManagement';

// Route Components
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminRoute from './components/routes/AdminRoute';
import AdminRestrictedRoute from './components/routes/AdminRestrictedRoute';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes (with admin restriction) */}
              <Route 
                path="/" 
                element={
                  <AdminRestrictedRoute>
                    <Home />
                  </AdminRestrictedRoute>
                } 
              />
              <Route 
                path="/products" 
                element={
                  <AdminRestrictedRoute>
                    <ProductList />
                  </AdminRestrictedRoute>
                } 
              />
              <Route 
                path="/products/:id" 
                element={
                  <AdminRestrictedRoute>
                    <ProductDetails />
                  </AdminRestrictedRoute>
                } 
              />
              <Route 
                path="/futsal-courts" 
                element={
                  <AdminRestrictedRoute>
                    <FutsalCourts />
                  </AdminRestrictedRoute>
                } 
              />
              
              {/* Auth Routes (no restriction needed) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/failure" element={<PaymentSuccess />} />

              {/* Protected Routes (with admin restriction) */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <AdminRestrictedRoute>
                    <Cart />
                  </AdminRestrictedRoute>
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <AdminRestrictedRoute>
                    <Favorites />
                  </AdminRestrictedRoute>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <AdminRestrictedRoute>
                    <Checkout />
                  </AdminRestrictedRoute>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/booking/:id" element={
                <ProtectedRoute>
                  <AdminRestrictedRoute>
                    <BookingForm />
                  </AdminRestrictedRoute>
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <AdminRestrictedRoute>
                    <MyBookings />
                  </AdminRestrictedRoute>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/applications" element={<AdminRoute><ApplicationsManagement /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProductList /></AdminRoute>} />
              <Route path="/admin/products/create" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
              <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUserList /></AdminRoute>} />
              <Route path="/admin/courts" element={<AdminRoute><AdminCourtList /></AdminRoute>} />
              <Route path="/admin/courts/new" element={<AdminRoute><AdminCourtForm /></AdminRoute>} />
              <Route path="/admin/courts/:id/edit" element={<AdminRoute><AdminCourtForm /></AdminRoute>} />
              <Route path="/admin/bookings" element={<AdminRoute><BookingsManagement /></AdminRoute>} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
