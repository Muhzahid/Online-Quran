import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as service from '../services/assignmentService.js';

export const list = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Assignments fetched', data: { items: await service.listAssignments(req.user) } }));
export const create = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, message: 'Assignment created', data: { assignment: await service.createAssignment(req.user, req.body) } }));
export const submit = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Assignment submitted', data: { assignment: await service.submitAssignment(req.user, req.params.id, req.body.answer) } }));
export const grade = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Submission graded', data: { assignment: await service.gradeSubmission(req.user, req.params.id, req.params.submissionId, req.body) } }));