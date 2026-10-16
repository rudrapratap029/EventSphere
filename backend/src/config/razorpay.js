import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_EventHub2026Key';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'eventhub_razorpay_secret_2026';

  return new Razorpay({
    key_id,
    key_secret
  });
};

export default getRazorpayInstance;
