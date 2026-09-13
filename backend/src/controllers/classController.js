import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as classService from '../services/classService.js';

export const listClasses = asyncHandler(async (req, res) => {
  const data = await classService.listClasses(req.user, req.query);
  sendSuccess(res, { message: 'Classes fetched', data });
});

export const getClass = asyncHandler(async (req, res) => {
  const item = await classService.getClass(req.params.id, req.user);
  sendSuccess(res, { message: 'Class fetched', data: { class: item } });
});

export const upsertAttendance = asyncHandler(async (req, res) => {
  const attendance = await classService.upsertAttendance(req.params.id, req.user, req.body);
  sendSuccess(res, { message: 'Attendance saved', data: { attendance } });
});