import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as authService from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: result.message,
    data: { user: result.user, token: result.token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  sendSuccess(res, {
    message: 'Login successful',
    data: { user: result.user, token: result.token },
  });
});

export const logout = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    message: 'Logout successful',
    data: null,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  sendSuccess(res, {
    message: 'Current user fetched',
    data: { user },
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await authService.verifyEmail(req.body.token);
  sendSuccess(res, {
    message: 'Email verified successfully',
    data: { user },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  sendSuccess(res, {
    message: result.message,
    data: null,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(
    req.body.token,
    req.body.password
  );
  sendSuccess(res, {
    message: result.message,
    data: { user: result.user, token: result.token },
  });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const result = await authService.resendVerificationEmail(req.user.id);
  sendSuccess(res, {
    message: result.message,
    data: null,
  });
});
