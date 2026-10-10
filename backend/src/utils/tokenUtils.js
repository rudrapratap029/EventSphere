import jwt from 'jsonwebtoken';

export const generateAccessToken = (entity) => {
  return jwt.sign(
    {
      id: entity._id,
      role: entity.role || (entity.companyName !== undefined ? 'organizer' : 'user'),
      email: entity.email
    },
    process.env.JWT_SECRET || 'eventhub_jwt_super_secret_key_2026',
    { expiresIn: '1d' }
  );
};

export const generateRefreshToken = (entity) => {
  return jwt.sign(
    {
      id: entity._id,
      role: entity.role || (entity.companyName !== undefined ? 'organizer' : 'user')
    },
    process.env.JWT_REFRESH_SECRET || 'eventhub_jwt_refresh_super_secret_2026',
    { expiresIn: '7d' }
  );
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || 'eventhub_jwt_refresh_super_secret_2026'
  );
};
