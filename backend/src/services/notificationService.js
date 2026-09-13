import Notification from '../models/Notification.js';

export const createNotification = (payload) => Notification.create(payload);
export const listNotifications = (userId) => Notification.find({ userId }).sort({ createdAt: -1 }).limit(100);
export const markRead = (userId, id) => Notification.findOneAndUpdate({ _id: id, userId }, { readAt: new Date() }, { new: true });
export const markAllRead = (userId) => Notification.updateMany({ userId, readAt: { $exists: false } }, { readAt: new Date() });