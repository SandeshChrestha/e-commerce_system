import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../../redux/slices/orderSlice';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { HmacSHA256, enc } from 'crypto-js';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [] } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'esewa',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) {
      navigate('/cart');
      toast.error('Your cart is empty');
    }
  }, [items, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'paymentMethod') {
      setShowCardDetails(value === 'card');
    }
  };

  const generateEsewaSignature = (secretKey, message) => {
    const hash = HmacSHA256(message, secretKey);
    return enc.Base64.stringify(hash);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderItems: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        totalPrice: items.reduce((total, item) => total + item.price * item.quantity, 0)
      };

      if (formData.paymentMethod === 'esewa') {
        const totalAmount = orderData.totalPrice.toString();
        const transactionUuid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const productCode = 'EPAYTEST'; // Test merchant code
        const secretKey = '8gBm/:&EnhH.1/q'; // Test secret key

        const signatureString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        const signature = generateEsewaSignature(secretKey, signatureString);

        const esewaPayload = {
          amount: totalAmount,
          tax_amount: '0',
          total_amount: totalAmount,
          transaction_uuid: transactionUuid,
          product_code: productCode,
          product_service_charge: '0',
          product_delivery_charge: '0',
          success_url: `${window.location.origin}/success?method=esewa`,
          failure_url: `${window.location.origin}/failure`,
          signed_field_names: 'total_amount,transaction_uuid,product_code',
          signature: signature
        };

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

        Object.entries(esewaPayload).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      } else {
        await dispatch(createOrder(orderData)).unwrap();
        toast.success('Order placed successfully!');
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <span>Rs {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>
                Rs {items.reduce((total, item) => total + item.price * item.quantity, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                formData.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <FaCreditCard className="mr-2" />
                <span>Credit Card</span>
              </label>

              <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                formData.paymentMethod === 'esewa' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="esewa"
                  checked={formData.paymentMethod === 'esewa'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>eSewa</span>
              </label>

              <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                formData.paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          {showCardDetails && (
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Card Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Processing...' : formData.paymentMethod === 'esewa' ? 'Proceed to eSewa' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 