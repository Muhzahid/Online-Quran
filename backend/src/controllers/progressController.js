import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as service from '../services/progressService.js';

export const list = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Progress fetched', data: { items: await service.listProgress(req.user.id) } }));
export const update = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Progress updated', data: { progress: await service.updateProgress(req.user.id, req.params.courseId, req.body) } }));