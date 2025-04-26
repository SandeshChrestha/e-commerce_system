import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, verifyOTP, clearError, sendOTP } from '../../redux/slices/authSlice';
import { redirectBasedOnRole } from '../../utils/authUtils';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: register form, 2: OTP verification
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, tempRegistration, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      redirectBasedOnRole(user, navigate);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (step === 1) {
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }

      try {
        await dispatch(register({ name, email, password })).unwrap();
        setStep(2);
      } catch (err) {
        setPasswordError(err.message || 'Registration failed');
      }
    } else {
      try {
        await dispatch(verifyOTP({ email, otp })).unwrap();
        navigate('/login');
      } catch (err) {
        setPasswordError(err.message || 'OTP verification failed');
      }
    }
  };

  const resendOTP = async () => {
    try {
      await dispatch(sendOTP({ email })).unwrap();
    } catch (err) {
      setPasswordError(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Create your account' : 'Verify Your Email'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(error || passwordError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error || passwordError}</span>
            </div>
          )}
          
          {step === 1 ? (
            <>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    We've sent a verification code to {email}
                  </p>
                  <label htmlFor="otp" className="sr-only">
                    OTP
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="text-sm mt-2">
                  <button
                    type="button"
                    onClick={resendOTP}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading
                ? 'Processing...'
                : step === 1
                ? 'Create account'
                : 'Verify Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;