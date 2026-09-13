import { sendError } from '../utils/ApiResponse.js';

const notFound = (req, res, next) => {
  sendError(res, {
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `Duplicate value for ${field}`;
    errors = [{ field, message }];
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('[API Error]', {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      message,
      stack: err.stack,
    });
  } else if (statusCode >= 500) {
    console.error('[API Error]', {
      method: req.method,
      url: req.originalUrl,
      statusCode,
      message,
    });
  }

  const response = {
    success: false,
    message: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : message,
    errors,
  };

  if (process.env.NODE_ENV !== 'production' && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export { notFound, errorHandler };
