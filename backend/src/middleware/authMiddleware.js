import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Organizer from '../models/organizerModel.js';

// Authenticate any valid user or organizer token
export const authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'eventhub_jwt_super_secret_key_2026'
      );

      let account = null;

      if (decoded.role === 'organizer') {
        account = await Organizer.findById(decoded.id).select('-password');
      } else {
        account = await User.findById(decoded.id).select('-password');
      }

      // Fallback check in alternate model if not found
      if (!account) {
        account = await Organizer.findById(decoded.id).select('-password') ||
                  await User.findById(decoded.id).select('-password');
      }

      if (!account) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: account no longer exists'
        });
      }

      req.user = account;
      // Backward compatibility for existing organizer controllers
      if (account.role === 'organizer') {
        req.organizer = account;
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: token is invalid or expired'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: no authentication token provided'
    });
  }
};

// Alias for authMiddleware
export const protect = authMiddleware;

// Role-based authorization middleware
export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: login required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' is not authorized to access this resource`
      });
    }

    next();
  };
};

export const authorizeRoles = roleMiddleware;

// Organizer protection middleware (combines auth + organizer role check)
export const protectOrganizer = [
  authMiddleware,
  roleMiddleware('organizer')
];
