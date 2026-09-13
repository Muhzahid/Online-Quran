import User from '../models/User.js';
import { AppError, asyncHandler } from '../utils/ApiResponse.js';
import { verifyToken } from '../utils/jwt.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AppError('Authentication required. Please log in.', 401);
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  req.user = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
    name: user.name,
    isVerified: user.isVerified,
  };

  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (user && user.isActive) {
      req.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      };
    }
  } catch {
    // Ignore invalid token for optional auth
  }

  next();
});
