import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as service from '../services/paymentService.js';

export const list = asyncHandler(async (req, res) => sendSuccess(res, { data: { items: await service.listPayments(req.user.id), subscription: await service.listSubscription(req.user.id) } }));
export const create = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, data: { payment: await service.createPayment(req.user.id, req.body) } }));
export const webhook = asyncHandler(async (req, res) => sendSuccess(res, { data: { payment: await service.handleWebhook(req.body) } }));