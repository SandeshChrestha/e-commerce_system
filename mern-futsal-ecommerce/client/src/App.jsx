import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Product Components
import ProductList from './components/products/ProductList';
import ProductDetails from './components/products/ProductDetails';
import Home from './components/pages/Home';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProductList from './components/admin/AdminProductList';
import AdminProductForm from './components/admin/AdminProductForm';
import AdminUserList from './components/admin/AdminUserList';
import AdminUserForm from './components/admin/AdminUserForm';
import Cart from './components/cart/Cart';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/cart" element={<Cart />} />
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProductList />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products/new"
                element={
                  <AdminRoute>
                    <AdminProductForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/products/edit/:id"
                element={
                  <AdminRoute>
                    <AdminProductForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUserList />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users/new"
                element={
                  <AdminRoute>
                    <AdminUserForm />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users/edit/:id"
                element={
                  <AdminRoute>
                    <AdminUserForm />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </Provider>
  );
};

export default App;