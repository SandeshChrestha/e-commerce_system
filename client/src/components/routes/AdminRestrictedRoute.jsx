import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isRouteAllowed } from '../../utils/authUtils';

/**
 * A route that redirects admin users to the admin dashboard
 * This prevents admin users from accessing regular user pages
 * @param {Object} children - The components to render if the user is not an admin
 */
const AdminRestrictedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const allowed = isRouteAllowed(user, location.pathname);

  useEffect(() => {
    if (user && user.isAdmin && !allowed) {
      console.log(`Admin user redirected from restricted route: ${location.pathname}`);
    }
  }, [user, location.pathname, allowed]);

  // If user is an admin and route is not allowed, redirect to admin dashboard
  if (user && user.isAdmin && !allowed) {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise, render the children
  return children;
};

export default AdminRestrictedRoute; 