import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as service from '../services/reviewService.js';

export const list = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Reviews fetched', data: { items: await service.listReviews(req.query) } }));
export const create = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, message: 'Review created', data: { review: await service.createReview(req.user.id, req.body.bookingId, req.body) } }));