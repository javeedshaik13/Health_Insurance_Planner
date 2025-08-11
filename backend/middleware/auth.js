const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if MongoDB is connected before querying
    if (User.db.readyState !== 1) {
      console.log('⚠️  Database not connected, skipping user lookup');
      // Create a mock user object for development
      req.user = {
        _id: decoded.userId,
        username: 'dev_user',
        email: 'dev@example.com',
        isActive: true
      };
      return next();
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        error: 'Token is not valid. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account is deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token is not valid.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired.'
      });
    }

    // Handle MongoDB connection errors gracefully
    if (error.name === 'MongooseError' || error.message.includes('buffering timed out')) {
      console.error('🔄 Database connection issue during auth, allowing request');
      // Create a mock user for development when DB is down
      try {
        const decoded = jwt.verify(req.header('Authorization')?.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = {
          _id: decoded.userId,
          username: 'dev_user',
          email: 'dev@example.com',
          isActive: true
        };
        return next();
      } catch (jwtError) {
        return res.status(401).json({
          error: 'Token is not valid.'
        });
      }
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Server error during authentication.'
    });
  }
};

module.exports = auth;
