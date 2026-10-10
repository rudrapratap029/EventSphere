import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Organizer from '../models/organizerModel.js';
import Event from '../models/eventModel.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'eventhub_jwt_super_secret_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Register new organizer
// @route   POST /api/organizers/register
// @access  Public
export const registerOrganizer = async (req, res, next) => {
  try {
    const { name, email, password, phone, companyName, city, bio, website } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingOrganizer = await Organizer.findOne({ email: email.toLowerCase().trim() });
    if (existingOrganizer) {
      return res.status(400).json({
        success: false,
        message: 'An organizer is already registered with this email address'
      });
    }

    const organizer = await Organizer.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim() || '',
      companyName: companyName?.trim() || '',
      city: city?.trim() || '',
      bio: bio?.trim() || '',
      website: website?.trim() || ''
    });

    const token = generateToken(organizer._id);

    res.status(201).json({
      success: true,
      message: 'Organizer registered successfully',
      data: {
        token,
        organizer: {
          _id: organizer._id,
          name: organizer.name,
          email: organizer.email,
          phone: organizer.phone,
          companyName: organizer.companyName,
          profileImage: organizer.profileImage,
          bio: organizer.bio,
          website: organizer.website,
          city: organizer.city,
          verified: organizer.verified,
          createdAt: organizer.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Organizer Login
// @route   POST /api/organizers/login
// @access  Public
export const loginOrganizer = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const organizer = await Organizer.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!organizer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await organizer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(organizer._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        organizer: {
          _id: organizer._id,
          name: organizer.name,
          email: organizer.email,
          phone: organizer.phone,
          companyName: organizer.companyName,
          profileImage: organizer.profileImage,
          bio: organizer.bio,
          website: organizer.website,
          city: organizer.city,
          verified: organizer.verified,
          createdAt: organizer.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get organizer profile (logged-in organizer)
// @route   GET /api/organizers/profile
// @access  Private (Organizer)
export const getOrganizerProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.organizer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update organizer profile
// @route   PUT /api/organizers/profile
// @access  Private (Organizer)
export const updateOrganizerProfile = async (req, res, next) => {
  try {
    const organizer = await Organizer.findById(req.organizer._id).select('+password');

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    const { name, phone, companyName, bio, website, city, profileImage, password } = req.body;

    if (name) organizer.name = name.trim();
    if (phone !== undefined) organizer.phone = phone.trim();
    if (companyName !== undefined) organizer.companyName = companyName.trim();
    if (bio !== undefined) organizer.bio = bio.trim();
    if (website !== undefined) organizer.website = website.trim();
    if (city !== undefined) organizer.city = city.trim();
    if (profileImage !== undefined) organizer.profileImage = profileImage.trim();

    if (password && password.trim().length >= 6) {
      organizer.password = password.trim();
    }

    await organizer.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        phone: organizer.phone,
        companyName: organizer.companyName,
        profileImage: organizer.profileImage,
        bio: organizer.bio,
        website: organizer.website,
        city: organizer.city,
        verified: organizer.verified,
        updatedAt: organizer.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get events belonging to current organizer
// @route   GET /api/organizers/events
// @access  Private (Organizer)
export const getOrganizerEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      $or: [
        { organizerId: req.organizer._id },
        { organizer: req.organizer.companyName || req.organizer.name }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create event as organizer
// @route   POST /api/organizers/events
// @access  Private (Organizer)
export const createOrganizerEvent = async (req, res, next) => {
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
    } = req.body;

    if (!title || !description || !category || !date || !time || !venue || !city || totalSeats === undefined || ticketPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const event = new Event({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      date,
      time: time.trim(),
      venue: venue.trim(),
      city: city.trim(),
      bannerImage: bannerImage?.trim() || undefined,
      organizer: req.organizer.companyName || req.organizer.name,
      organizerId: req.organizer._id,
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

// @desc    Edit own event
// @route   PUT /api/organizers/events/:id
// @access  Private (Organizer)
export const updateOrganizerEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Enforce ownership: Organizer can only edit their own events
    const isOwner =
      (event.organizerId && event.organizerId.toString() === req.organizer._id.toString()) ||
      event.organizer === req.organizer.name ||
      event.organizer === req.organizer.companyName;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit your own events'
      });
    }

    // Update fields and keep organizerId bound
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        ...req.body,
        organizerId: req.organizer._id,
        organizer: req.organizer.companyName || req.organizer.name
      },
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

// @desc    Delete own event
// @route   DELETE /api/organizers/events/:id
// @access  Private (Organizer)
export const deleteOrganizerEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Enforce ownership: Organizer can only delete their own events
    const isOwner =
      (event.organizerId && event.organizerId.toString() === req.organizer._id.toString()) ||
      event.organizer === req.organizer.name ||
      event.organizer === req.organizer.companyName;

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

// @desc    Get organizer dashboard stats and event analytics
// @route   GET /api/organizers/dashboard
// @access  Private (Organizer)
export const getOrganizerDashboard = async (req, res, next) => {
  try {
    const events = await Event.find({
      $or: [
        { organizerId: req.organizer._id },
        { organizer: req.organizer.companyName || req.organizer.name }
      ]
    }).sort({ date: 1, createdAt: -1 });

    let totalBookings = 0;
    let totalRevenue = 0;
    let upcomingEvents = 0;
    let ongoingEvents = 0;
    let completedEvents = 0;
    let cancelledEvents = 0;
    let totalCapacity = 0;
    let totalAvailableSeats = 0;

    const analytics = events.map((event) => {
      const available = event.availableSeats ?? event.totalSeats;
      const sold = Math.max(0, event.totalSeats - available);
      const revenue = sold * (event.ticketPrice || 0);
      const occupancyRate = event.totalSeats > 0 ? Math.round((sold / event.totalSeats) * 100) : 0;

      totalBookings += sold;
      totalRevenue += revenue;
      totalCapacity += event.totalSeats;
      totalAvailableSeats += available;

      switch (event.status) {
        case 'upcoming':
          upcomingEvents += 1;
          break;
        case 'ongoing':
          ongoingEvents += 1;
          break;
        case 'completed':
          completedEvents += 1;
          break;
        case 'cancelled':
          cancelledEvents += 1;
          break;
        default:
          upcomingEvents += 1;
      }

      return {
        eventId: event._id,
        title: event.title,
        category: event.category,
        date: event.date,
        time: event.time,
        status: event.status,
        ticketPrice: event.ticketPrice,
        totalSeats: event.totalSeats,
        availableSeats: available,
        soldSeats: sold,
        revenue,
        occupancyRate
      };
    });

    const stats = {
      totalEvents: events.length,
      upcomingEvents,
      ongoingEvents,
      completedEvents,
      cancelledEvents,
      totalBookings,
      totalRevenue,
      totalCapacity,
      totalAvailableSeats
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        analytics,
        recentEvents: events.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public organizer profile by ID
// @route   GET /api/organizers/:id
// @access  Public
export const getPublicOrganizerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organizer ID'
      });
    }

    const organizer = await Organizer.findById(id).select('-password');

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    const eventCount = await Event.countDocuments({
      $or: [
        { organizerId: organizer._id },
        { organizer: organizer.companyName || organizer.name }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        ...organizer.toObject(),
        totalEvents: eventCount
      }
    });
  } catch (error) {
    next(error);
  }
};
