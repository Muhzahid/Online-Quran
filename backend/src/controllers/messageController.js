import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as service from '../services/messageService.js';

export const conversations = asyncHandler(async (req, res) => sendSuccess(res, { data: { items: await service.listConversations(req.user.id) } }));
export const messages = asyncHandler(async (req, res) => sendSuccess(res, { data: { items: await service.listMessages(req.params.id, req.user.id) } }));
export const create = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, data: { conversation: await service.createConversation(req.user.id, req.body.participantId) } }));
export const send = asyncHandler(async (req, res) => sendSuccess(res, { statusCode: 201, data: { message: await service.sendMessage(req.params.id, req.user.id, req.body.body) } }));