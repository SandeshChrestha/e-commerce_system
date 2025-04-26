/**
 * Auth Utilities
 * Helper functions for auth-related operations
 */

/**
 * Redirects a user based on their role
 * @param {Object} user - The user object
 * @param {Function} navigate - React Router's navigate function
 * @param {string} [fallbackPath='/'] - Default path for non-admin users
 */
export const redirectBasedOnRole = (user, navigate, fallbackPath = '/') => {
  if (!user) return;
  
  if (user.isAdmin) {
    navigate('/admin');
  } else {
    navigate(fallbackPath);
  }
};

/**
 * Checks if a user has access to a route based on their role
 * @param {Object} user - The user object
 * @param {string} pathname - The current route path
 * @returns {boolean} - True if the user can access the route, false otherwise
 */
export const isRouteAllowed = (user, pathname) => {
  // If no user or not an admin, allow access to all routes
  if (!user || !user.isAdmin) {
    return true;
  }
  
  // Admin users are only allowed to access admin routes
  return pathname.startsWith('/admin') || 
         pathname === '/login' || 
         pathname === '/register' || 
         pathname === '/profile' || 
         pathname === '/forgot-password' ||
         pathname === '/reset-password';
}; 