import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    seatNumber: {
      type: String,
      trim: true,
      default: ''
    },
    ticketNumber: {
      type: String,
      required: [true, 'Ticket number is required'],
      unique: true,
      trim: true
    },
    orderId: {
      type: String,
      trim: true,
      default: ''
    },
    paymentId: {
      type: String,
      trim: true,
      default: ''
    },
    amount: {
      type: Number,
      default: 0,
      min: [0, 'Amount cannot be negative']
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Total price cannot be negative']
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed'],
        message: '{VALUE} is not a valid payment status'
      },
      default: 'pending'
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    seats: {
      type: Number,
      default: 1,
      min: [1, 'Seats must be at least 1']
    },
    qrCode: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'Booked', 'Cancelled', 'Used'],
        message: '{VALUE} is not a valid ticket status'
      },
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast lookups and payment uniqueness checks
ticketSchema.index({ user: 1, createdAt: -1 });
ticketSchema.index({ event: 1, seatNumber: 1 });
ticketSchema.index({ orderId: 1 });
ticketSchema.index({ paymentId: 1 });

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
