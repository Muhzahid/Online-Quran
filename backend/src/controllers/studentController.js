import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as studentService from '../services/studentService.js';

export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await studentService.getOrCreateStudentProfile(req.user.id);
  sendSuccess(res, { message: 'Student profile fetched', data: { profile } });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await studentService.updateStudentProfile(
    req.user.id,
    req.body
  );
  sendSuccess(res, { message: 'Profile updated', data: { profile } });
});
