import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOTP, resetPassword } from '../../redux/slices/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifiedOTP, setVerifiedOTP] = useState(''); // Store the verified OTP

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (step === 1) {
        if (!email) {
          setError('Email is required');
          return;
        }
        await dispatch(forgotPassword({ email })).unwrap();
        setSuccess('OTP has been sent to your email');
        setStep(2);
      } else if (step === 2) {
        if (!otp) {
          setError('OTP is required');
          return;
        }
        // First verify the OTP
        await dispatch(verifyOTP({ email, otp })).unwrap();
        setVerifiedOTP(otp); // Store the verified OTP
        setSuccess('Email verified successfully');
        setStep(3);
      } else if (step === 3) {
        if (!newPassword || !confirmPassword) {
          setError('Both password fields are required');
          return;
        }
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        // Use the stored verified OTP for password reset
        const resetData = {
          email,
          otp: verifiedOTP,
          password: newPassword
        };
        console.log('Sending reset data:', resetData); // Debug log
        await dispatch(resetPassword(resetData)).unwrap();
        setSuccess('Password has been reset successfully');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      if (err?.message?.includes('expired')) {
        setError('OTP has expired. Please request a new one.');
        setStep(1);
        setVerifiedOTP(''); // Clear the verified OTP
      } else {
        setError(err.message || 'Something went wrong');
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setSuccess('New OTP has been sent to your email');
      setError('');
      setVerifiedOTP(''); // Clear the verified OTP when requesting a new one
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 && 'Reset your password'}
            {step === 2 && 'Enter verification code'}
            {step === 3 && 'Set new password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              back to login
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                type="button"
                onClick={handleResendOTP}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                Resend verification code
              </button>
            </div>
          )}

          {step === 3 && (
            <>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
                ? 'Send Reset Link'
                : step === 2
                ? 'Verify Code'
                : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;