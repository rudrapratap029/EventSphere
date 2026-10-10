import mongoose from 'mongoose';
import Event from '../models/eventModel.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Public
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
      organizer,
      totalSeats,
      availableSeats,
      ticketPrice,
      status
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !date || !time || !venue || !city || !organizer || totalSeats === undefined || ticketPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const event = new Event({
      title,
      description,
      category,
      date,
      time,
      venue,
      city,
      bannerImage: bannerImage || undefined,
      organizer,
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
// @access  Public
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

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      req.body,
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
// @access  Public
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

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
