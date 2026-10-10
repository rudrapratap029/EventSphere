import User from '../models/userModel.js';
import Organizer from '../models/organizerModel.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/tokenUtils.js';

// Helper to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// @desc    Register new User (Attendee)
// @route   POST /api/auth/user/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if email already registered in User or Organizer
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account is already registered with this email address'
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim() || '',
      profileImage: profileImage?.trim() || undefined,
      role: 'user'
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        accessToken,
        refreshToken,
        token: accessToken, // convenient fallback
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login User (Attendee)
// @route   POST /api/auth/user/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password +refreshToken');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        accessToken,
        refreshToken,
        token: accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register Organizer
// @route   POST /api/auth/organizer/register
// @access  Public
export const registerOrganizer = async (req, res, next) => {
  try {
    const { name, email, password, companyName, phone, city, bio, website, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const existingOrganizer = await Organizer.findOne({ email: email.toLowerCase().trim() });
    if (existingOrganizer) {
      return res.status(400).json({
        success: false,
        message: 'An organizer account is already registered with this email address'
      });
    }

    const organizer = await Organizer.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      companyName: companyName?.trim() || '',
      phone: phone?.trim() || '',
      city: city?.trim() || '',
      bio: bio?.trim() || '',
      website: website?.trim() || '',
      profileImage: profileImage?.trim() || undefined,
      role: 'organizer'
    });

    const accessToken = generateAccessToken(organizer);
    const refreshToken = generateRefreshToken(organizer);

    organizer.refreshToken = refreshToken;
    await organizer.save();

    res.status(201).json({
      success: true,
      message: 'Organizer registered successfully',
      data: {
        accessToken,
        refreshToken,
        token: accessToken,
        user: {
          _id: organizer._id,
          name: organizer.name,
          email: organizer.email,
          companyName: organizer.companyName,
          phone: organizer.phone,
          city: organizer.city,
          bio: organizer.bio,
          website: organizer.website,
          profileImage: organizer.profileImage,
          role: 'organizer',
          verified: organizer.verified,
          createdAt: organizer.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login Organizer
// @route   POST /api/auth/organizer/login
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

    const organizer = await Organizer.findOne({ email: email.toLowerCase().trim() }).select('+password +refreshToken');

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

    const accessToken = generateAccessToken(organizer);
    const refreshToken = generateRefreshToken(organizer);

    organizer.refreshToken = refreshToken;
    await organizer.save();

    res.status(200).json({
      success: true,
      message: 'Organizer logged in successfully',
      data: {
        accessToken,
        refreshToken,
        token: accessToken,
        user: {
          _id: organizer._id,
          name: organizer.name,
          email: organizer.email,
          companyName: organizer.companyName,
          phone: organizer.phone,
          city: organizer.city,
          bio: organizer.bio,
          website: organizer.website,
          profileImage: organizer.profileImage,
          role: 'organizer',
          verified: organizer.verified,
          createdAt: organizer.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged In Profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout User / Organizer
// @route   POST /api/auth/logout
// @access  Private / Public
export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      if (req.user.role === 'organizer') {
        await Organizer.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
      } else {
        await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    let account = null;
    if (decoded.role === 'organizer') {
      account = await Organizer.findById(decoded.id).select('+refreshToken');
    } else {
      account = await User.findById(decoded.id).select('+refreshToken');
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Account not found'
      });
    }

    const newAccessToken = generateAccessToken(account);
    const newRefreshToken = generateRefreshToken(account);

    account.refreshToken = newRefreshToken;
    await account.save();

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        token: newAccessToken
      }
    });
  } catch (error) {
    next(error);
  }
};
