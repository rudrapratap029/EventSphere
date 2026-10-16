import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required']
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'Ticket is required']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    razorpayOrderId: {
      type: String,
      required: [true, 'Razorpay order ID is required'],
      trim: true
    },
    razorpayPaymentId: {
      type: String,
      required: [true, 'Razorpay payment ID is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'success'
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 }, { unique: true });
paymentSchema.index({ user: 1, createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
