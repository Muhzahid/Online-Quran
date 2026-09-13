import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as service from '../services/notificationService.js';

export const list = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Notifications fetched', data: { items: await service.listNotifications(req.user.id) } }));
export const markRead = asyncHandler(async (req, res) => sendSuccess(res, { message: 'Notification marked read', data: { notification: await service.markRead(req.user.id, req.params.id) } }));
export const markAllRead = asyncHandler(async (req, res) => { await service.markAllRead(req.user.id); sendSuccess(res, { message: 'Notifications marked read' }); });