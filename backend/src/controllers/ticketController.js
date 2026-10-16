import mongoose from 'mongoose';
import QRCode from 'qrcode';
import Ticket from '../models/ticketModel.js';
import Event from '../models/eventModel.js';

// @desc    Book ticket for an active event
// @route   POST /api/tickets/book
// @access  Private (Role: user only)
export const bookTicket = async (req, res, next) => {
  try {
    const { eventId, event: eventFromBody, seatNumber, paymentId } = req.body;
    const targetEventId = eventId || eventFromBody;
    const requestedSeats = Math.max(1, Number(req.body.seats) || 1);

    // 1. Role validation: Only regular users can book tickets
    if (req.user?.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only attendees with role "user" can book tickets'
      });
    }

    // 2. Validate Event ID
    if (!targetEventId || !mongoose.Types.ObjectId.isValid(targetEventId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid event ID is required'
      });
    }

    // 3. Find the event
    const event = await Event.findById(targetEventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // 4. Validate Event is active (upcoming or ongoing, not completed or cancelled)
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

    // 6. Seat allocation & duplicate seat prevention
    let assignedSeat = '';
    if (seatNumber && typeof seatNumber === 'string' && seatNumber.trim()) {
      const trimmedSeat = seatNumber.trim();
      const existingSeatTicket = await Ticket.findOne({
        event: event._id,
        seatNumber: trimmedSeat,
        status: 'Booked'
      });

      if (existingSeatTicket) {
        return res.status(400).json({
          success: false,
          message: `Seat "${trimmedSeat}" is already booked. Please choose a different seat.`
        });
      }
      assignedSeat = trimmedSeat;
    } else {
      // Automatic non-colliding seat designation
      const bookedCount = event.totalSeats - available;
      assignedSeat = requestedSeats === 1
        ? `S-${bookedCount + 1}`
        : `S-${bookedCount + 1}-S-${bookedCount + requestedSeats}`;
    }

    // 7. Generate Ticket Number
    const ticketNumber = `TICK-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 8. Generate QR Code containing Ticket Number, Event ID, and User ID
    const qrPayload = JSON.stringify({
      ticketNumber,
      eventId: event._id.toString(),
      userId: req.user._id.toString()
    });
    const qrCode = await QRCode.toDataURL(qrPayload);

    // 9. Payment ID generation if not provided
    const assignedPaymentId = paymentId?.trim() || `PAY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 10. Deduct available seats
    event.availableSeats = available - requestedSeats;
    await event.save();

    // 11. Create Ticket record
    const ticket = await Ticket.create({
      event: event._id,
      user: req.user._id,
      seatNumber: assignedSeat,
      ticketNumber,
      qrCode,
      paymentId: assignedPaymentId,
      bookingDate: new Date(),
      seats: requestedSeats,
      totalPrice: requestedSeats * (event.ticketPrice || 0),
      status: 'Booked'
    });

    // Populate references before sending response
    await ticket.populate([
      'event',
      { path: 'user', select: 'name email phone profileImage' }
    ]);

    return res.status(201).json({
      success: true,
      message: 'Ticket booked successfully!',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tickets belonging to logged-in user
// @route   GET /api/tickets/my
// @access  Private (Role: user only)
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket by ID (Owner only)
// @route   GET /api/tickets/:id
// @access  Private (Owner only)
export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ticket ID format'
      });
    }

    const ticket = await Ticket.findById(id)
      .populate('event')
      .populate({ path: 'user', select: 'name email phone profileImage' });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Strict ownership verification: A user must never access another user's ticket
    const ticketOwnerId = ticket.user?._id ? ticket.user._id.toString() : ticket.user?.toString();
    if (ticketOwnerId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to view this ticket'
      });
    }

    return res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};
