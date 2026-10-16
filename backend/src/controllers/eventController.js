import mongoose from 'mongoose';
import Event from '../models/eventModel.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      city,
      bannerImage,
      totalSeats,
      availableSeats,
      ticketPrice,
      status
    } = req.body || {};

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !time ||
      !venue ||
      !city ||
      totalSeats === undefined ||
      ticketPrice === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Strictly enforce organizerId from authenticated JWT
    const organizerId = req.user._id;
    const organizerName = req.user.companyName || req.user.name || 'Organizer';

    const event = new Event({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      date,
      time: time.trim(),
      venue: venue.trim(),
      city: city.trim(),
      bannerImage: bannerImage?.trim() || undefined,
      organizer: organizerName,
      organizerId,
      totalSeats: Number(totalSeats),
      availableSeats: availableSeats !== undefined ? Number(availableSeats) : Number(totalSeats),
      ticketPrice: Number(ticketPrice),
      status: status || 'upcoming'
    });

    const savedEvent = await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: savedEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events (with optional search and category filter)
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;

    const query = {};

    // Search by title or city (case-insensitive)
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { city: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Status filter
    if (status && status.trim() !== '' && status.toLowerCase() !== 'all') {
      query.status = status.trim().toLowerCase();
    }

    const events = await Event.find(query).sort({ date: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event by ID
// @route   PUT /api/events/:id
// @access  Private (Organizer - Own events only)
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const existingEvent = await Event.findById(id);

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Ownership check: Organizer can only edit their own events
    const isOwner =
      (existingEvent.organizerId && existingEvent.organizerId.toString() === req.user._id.toString()) ||
      existingEvent.organizer === req.user.name ||
      existingEvent.organizer === req.user.companyName;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own events'
      });
    }

    // Build update object and strictly enforce organizerId from authenticated JWT
    const updateData = { ...(req.body || {}) };
    delete updateData.organizerId;
    updateData.organizerId = req.user._id;
    updateData.organizer = req.user.companyName || req.user.name || existingEvent.organizer;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true, returnDocument: 'after', runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event by ID
// @route   DELETE /api/events/:id
// @access  Private (Organizer - Own events only)
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Ownership check: Organizer can only delete their own events
    const isOwner =
      (event.organizerId && event.organizerId.toString() === req.user._id.toString()) ||
      event.organizer === req.user.name ||
      event.organizer === req.user.companyName;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own events'
      });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book ticket seats for an event
// @route   POST /api/events/:id/book
// @access  Public / Attendee
export const bookEventTickets = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { seats } = req.body || {};
    const requestedSeats = Math.max(1, Number(seats) || 1);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const available = event.availableSeats ?? event.totalSeats;
    if (available < requestedSeats) {
      return res.status(400).json({
        success: false,
        message: `Only ${available} seat(s) remaining for this event`
      });
    }

    event.availableSeats = available - requestedSeats;
    if (event.availableSeats === 0) {
      event.status = 'completed';
    }

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: `Successfully booked ${requestedSeats} ticket(s)!`,
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};
