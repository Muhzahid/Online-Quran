export class AppError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const sendSuccess = (res, { statusCode = 200, message = 'Operation successful', data = null } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, { statusCode = 500, message = 'Something went wrong', errors = [] } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
