// Security middleware for Express/Next.js
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.API_RATE_LIMIT || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many uploads from this IP',
});

// Input validation
const validateFileUpload = [
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('No file provided');
    }
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || 10485760); // 10MB default
    if (req.file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize} bytes`);
    }
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '.pdf,.doc,.docx').split(',');
    const fileExt = '.' + req.file.originalname.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      throw new Error(`File type ${fileExt} not allowed`);
    }
    return true;
  })
];

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
};

module.exports = {
  helmet,
  corsOptions,
  limiter,
  uploadLimiter,
  validateFileUpload,
  errorHandler
};
