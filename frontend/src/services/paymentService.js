import api from './api';

// Dynamically load Razorpay Checkout script if not already present
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create a Razorpay payment order
export const createPaymentOrder = async (orderData) => {
  const response = await api.post('/payment/create-order', orderData);
  return response.data;
};

// Verify payment cryptographic signature & issue confirmed ticket
export const verifyPayment = async (paymentData) => {
  const response = await api.post('/payment/verify', paymentData);
  return response.data;
};

// Retrieve public Razorpay Key ID from backend
export const getRazorpayKey = async () => {
  const response = await api.get('/payment/key');
  return response.data;
};
