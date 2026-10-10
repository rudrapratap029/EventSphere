import jwt from 'jsonwebtoken';
import Organizer from '../models/organizerModel.js';

export const protectOrganizer = async (req, res, next) => {
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

      const organizer = await Organizer.findById(decoded.id).select('-password');

      if (!organizer) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, organizer not found'
        });
      }

      req.organizer = organizer;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no authorization token provided'
    });
  }
};
