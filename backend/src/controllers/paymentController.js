import crypto from 'crypto';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import getRazorpayInstance from '../config/razorpay.js';
import Ticket from '../models/ticketModel.js';
import Payment from '../models/paymentModel.js';
import Event from '../models/eventModel.js';

// @desc    Create Razorpay Order for ticket booking
// @route   POST /api/payment/create-order
// @access  Private (Role: user only)
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { eventId, seats = 1, seatNumber } = req.body;
    const requestedSeats = Math.max(1, Number(seats) || 1);

    // 1. Role verification: Only attendees (role: 'user') can book tickets
    if (req.user?.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only attendees with role "user" can book tickets'
      });
    }

    // 2. Validate Event ID
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid event ID is required'
      });
    }

    // 3. Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // 4. Validate Event is active
    const activeStatuses = ['upcoming', 'ongoing'];
    if (!activeStatuses.includes(event.status?.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Cannot book tickets for inactive event (Current status: ${event.status})`
      });
    }

    // 5. Seat availability check
    const available = event.availableSeats !== undefined && event.availableSeats !== null
      ? event.availableSeats
      : event.totalSeats;

    if (available <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Event is completely sold out'
      });
    }

    if (requestedSeats > available) {
      return res.status(400).json({
        success: false,
        message: `Only ${available} seat(s) remaining for this event`
      });
    }

    // 6. Duplicate seat check if seat number was requested
    if (seatNumber && typeof seatNumber === 'string' && seatNumber.trim()) {
      const trimmedSeat = seatNumber.trim();
      const existingSeatTicket = await Ticket.findOne({
        event: event._id,
        seatNumber: trimmedSeat,
        status: { $in: ['confirmed', 'Booked'] }
      });

      if (existingSeatTicket) {
        return res.status(400).json({
          success: false,
          message: `Seat "${trimmedSeat}" is already booked. Please select another seat.`
        });
      }
    }

    // 7. Calculate total amount in INR (convert to paise for Razorpay: 1 INR = 100 paise)
    const ticketPrice = Number(event.ticketPrice) || 0;
    const totalAmount = requestedSeats * ticketPrice;
    // Razorpay amount is in paise (1 INR = 100 paise)
    const amountInPaise = Math.max(100, Math.round(totalAmount * 100));

    // 8. Unique booking receipt reference
    const receipt = `rcpt_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    // 9. Create Order with Razorpay SDK
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        eventId: event._id.toString(),
        eventTitle: event.title,
        userId: req.user._id.toString(),
        seats: requestedSeats.toString(),
        seatNumber: seatNumber || ''
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        order,
        keyId: process.env.RAZORPAY_KEY_ID,
        event: {
          _id: event._id,
          title: event.title,
          bannerImage: event.bannerImage,
          ticketPrice: event.ticketPrice,
          date: event.date,
          time: event.time,
          venue: event.venue
        },
        seats: requestedSeats,
        seatNumber: seatNumber || '',
        totalAmount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature & create confirmed ticket
// @route   POST /api/payment/verify
// @access  Private (Role: user only)
export const verifyPaymentAndCreateTicket = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      seats = 1,
      seatNumber
    } = req.body;

    // 1. Role verification: Only attendees (role: 'user') can purchase tickets
    if (req.user?.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only attendees with role "user" can purchase tickets'
      });
    }

    // 2. Validate essential payment verification payload
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Incomplete payment details: order_id, payment_id, and signature are required'
      });
    }

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid event ID is required'
      });
    }

    // 3. Cryptographic Signature Verification using crypto
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid payment signature. No ticket was created.'
      });
    }

    // 4. Prevent duplicate payment processing & duplicate ticket generation
    const existingPayment = await Payment.findOne({
      $or: [
        { razorpayPaymentId: razorpay_payment_id },
        { razorpayOrderId: razorpay_order_id }
      ]
    });

    if (existingPayment) {
      const existingTicket = await Ticket.findById(existingPayment.ticket).populate([
        'event',
        { path: 'user', select: 'name email phone profileImage' }
      ]);
      return res.status(400).json({
        success: false,
        message: 'This payment has already been verified and a ticket has already been issued.',
        data: existingTicket
      });
    }

    const existingTicket = await Ticket.findOne({
      $or: [
        { paymentId: razorpay_payment_id },
        { orderId: razorpay_order_id }
      ]
    });

    if (existingTicket) {
      return res.status(400).json({
        success: false,
        message: 'This payment has already been verified and a ticket has already been issued.',
        data: existingTicket
      });
    }

    // 5. Find the event and re-verify seat availability
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const requestedSeats = Math.max(1, Number(seats) || 1);
    const available = event.availableSeats !== undefined && event.availableSeats !== null
      ? event.availableSeats
      : event.totalSeats;

    if (available < requestedSeats) {
      return res.status(400).json({
        success: false,
        message: `Insufficient seats: only ${available} seat(s) remain`
      });
    }

    // 6. Seat allocation and duplicate seat prevention
    let assignedSeat = '';
    if (seatNumber && typeof seatNumber === 'string' && seatNumber.trim()) {
      const trimmedSeat = seatNumber.trim();
      const existingSeatTicket = await Ticket.findOne({
        event: event._id,
        seatNumber: trimmedSeat,
        status: { $in: ['confirmed', 'Booked'] }
      });

      if (existingSeatTicket) {
        return res.status(400).json({
          success: false,
          message: `Seat "${trimmedSeat}" is already taken.`
        });
      }
      assignedSeat = trimmedSeat;
    } else {
      const bookedCount = event.totalSeats - available;
      assignedSeat = requestedSeats === 1
        ? `S-${bookedCount + 1}`
        : `S-${bookedCount + 1}-S-${bookedCount + requestedSeats}`;
    }

    // 7. Generate unique Ticket Number & pre-allocate Ticket ID
    const ticketNumber = `TICK-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketId = new mongoose.Types.ObjectId();

    // 8. Generate QR Code containing Ticket Number, Ticket ID, Event ID, User ID
    const qrPayload = JSON.stringify({
      ticketNumber,
      ticketId: ticketId.toString(),
      eventId: event._id.toString(),
      userId: req.user._id.toString()
    });
    const qrCode = await QRCode.toDataURL(qrPayload);

    // 9. Reduce available seats in Event document
    event.availableSeats = available - requestedSeats;
    await event.save();

    // 10. Calculate amount
    const ticketPrice = Number(event.ticketPrice) || 0;
    const totalAmount = requestedSeats * ticketPrice;

    // 11. Create Confirmed Ticket record
    const ticket = await Ticket.create({
      _id: ticketId,
      event: event._id,
      user: req.user._id,
      seatNumber: assignedSeat,
      ticketNumber,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: totalAmount,
      totalPrice: totalAmount,
      paymentStatus: 'paid',
      status: 'confirmed',
      bookingDate: new Date(),
      seats: requestedSeats,
      qrCode
    });

    // 12. Save payment details in database (Payment model)
    const payment = await Payment.create({
      user: req.user._id,
      event: event._id,
      ticket: ticket._id,
      amount: totalAmount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'success'
    });

    // Populate references before sending response
    await ticket.populate([
      'event',
      { path: 'user', select: 'name email phone profileImage' }
    ]);

    return res.status(201).json({
      success: true,
      message: 'Payment verified and ticket confirmed successfully!',
      data: ticket,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Razorpay Public Key ID
// @route   GET /api/payment/key
// @access  Public / Private
export const getRazorpayKey = (req, res) => {
  return res.status(200).json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_ToXQG2EDOZZZzc'
  });
};
