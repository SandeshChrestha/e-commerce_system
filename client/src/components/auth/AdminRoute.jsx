import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !user.isAdmin) {
    // Redirect to home if not authenticated or not an admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 