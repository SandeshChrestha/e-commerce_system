import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse the URL parameters
    const searchParams = new URLSearchParams(location.search);
    const method = searchParams.get('method');
    const data = searchParams.get('data');

    if (data) {
      try {
        const decodedData = JSON.parse(atob(data));
        if (decodedData.status === 'COMPLETE') {
          toast.success('Payment successful!');
        } else {
          toast.error('Payment failed. Please try again.');
        }
      } catch (error) {
        console.error('Error parsing payment data:', error);
        toast.error('Error processing payment. Please contact support.');
      }
    }

    // Redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Processed!</h2>
        <p className="text-gray-600">You will be redirected to the home page shortly...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess; 