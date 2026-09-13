import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as service from '../services/adminService.js';

export const students = asyncHandler(async (req, res) => sendSuccess(res, { data: await service.listStudents(req.query) }));
export const updateStudent = asyncHandler(async (req, res) => sendSuccess(res, { data: { student: await service.updateStudent(req.params.id, req.body.isActive) } }));
export const report = asyncHandler(async (req, res) => sendSuccess(res, { data: await service.report() }));
export const contacts = asyncHandler(async (req, res) => sendSuccess(res, { data: { items: await service.contactMessages(req.query) } }));