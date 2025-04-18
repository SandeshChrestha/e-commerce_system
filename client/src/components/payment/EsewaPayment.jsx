import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EsewaPayment = ({ bookingId, amount }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const path = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
    const params = {
      amount: amount,
      taxAmount: 0,
      totalAmount: amount,
      transactionId: bookingId,
      productCode: 'EPAYTEST',
      productServiceCharge: 0,
      productDeliveryCharge: 0,
      successUrl: `${window.location.origin}/payment/success`,
      failureUrl: `${window.location.origin}/payment/failure`,
      signedFieldNames: 'totalAmount,transactionId,productCode',
      signature: 'dummy_signature', // Replace with actual signature generation
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = path;

    Object.keys(params).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }, [bookingId, amount]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default EsewaPayment; 