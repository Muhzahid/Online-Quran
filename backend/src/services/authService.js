import crypto from 'crypto';
import User from '../models/User.js';
import { AppError } from '../utils/ApiResponse.js';
import { signToken } from '../utils/jwt.js';
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from './emailService.js';

const sanitizeUser = (user) => {
  const obj = user.toJSON ? user.toJSON() : user;
  return obj;
};

export const registerUser = async ({ name, email, password, phone, role }) => {
  const allowedRoles = ['student', 'teacher'];
  const selectedRole = allowedRoles.includes(role) ? role : 'student';

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('Email is already registered', 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    phone: phone || '',
    role: selectedRole,
  });

  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  await sendWelcomeEmail(user);
  await sendVerificationEmail(user, verificationToken);

  const token = signToken(user._id, user.role);

  return {
    user: sanitizeUser(user),
    token,
    message:
      selectedRole === 'teacher'
        ? 'Teacher account created. Please verify your email and complete your profile for admin approval.'
        : 'Registration successful. Please verify your email.',
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password'
  );

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Contact support.', 403);
  }

  const token = signToken(user._id, user.role);

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }
  return sanitizeUser(user);
};

export const verifyEmail = async (token) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return sanitizeUser(user);
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  // Do not reveal whether email exists
  if (!user) {
    return {
      message: 'If that email exists, a password reset link has been sent.',
    };
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  await sendPasswordResetEmail(user, resetToken);

  return {
    message: 'If that email exists, a password reset link has been sent.',
  };
};

export const resetPassword = async (token, password) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const authToken = signToken(user._id, user.role);

  return {
    user: sanitizeUser(user),
    token: authToken,
    message: 'Password reset successful',
  };
};

export const resendVerificationEmail = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  if (user.isVerified) {
    throw new AppError('Email is already verified', 400);
  }

  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  await sendVerificationEmail(user, verificationToken);

  return { message: 'Verification email sent' };
};
