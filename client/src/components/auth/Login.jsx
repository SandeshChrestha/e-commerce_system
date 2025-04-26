import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError, sendOTP } from '../../redux/slices/authSlice';
import { redirectBasedOnRole } from '../../utils/authUtils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  // Redirect based on user role when user state changes
  useEffect(() => {
    if (user) {
      redirectBasedOnRole(user, navigate);
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowVerificationMessage(false);
    try {
      await dispatch(login({ email, password })).unwrap();
      // Redirection is handled by the useEffect when user state updates
    } catch (err) {
      console.error('Login Error:', err);
      if (err?.message?.includes('verify your email')) {
        setShowVerificationMessage(true);
        // Automatically send new OTP
        try {
          await dispatch(sendOTP({ email })).unwrap();
        } catch (otpError) {
          console.error('Failed to send OTP:', otpError);
        }
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      await dispatch(sendOTP({ email })).unwrap();
    } catch (err) {
      console.error('Failed to resend verification:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
              {showVerificationMessage && (
                <div className="mt-2">
                  <p>We've sent a new verification code to your email.</p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="text-blue-600 hover:text-blue-500 underline mt-1"
                  >
                    Resend verification code
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="text-sm text-center mt-4">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 