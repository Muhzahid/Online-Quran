import Payment from '../models/Payment.js';
import Subscription from '../models/Subscription.js';
import Course from '../models/Course.js';
import { AppError } from '../utils/ApiResponse.js';

export const listPayments = (userId) => Payment.find({ userId }).populate('courseId', 'title').sort({ createdAt: -1 });
export const listSubscription = (userId) => Subscription.findOne({ userId });
export const createPayment = async (userId, payload) => {
  const course = payload.courseId ? await Course.findById(payload.courseId) : null;
  if (payload.courseId && !course) throw new AppError('Course not found', 404);
  return Payment.create({ userId, courseId: payload.courseId, amount: course?.price ?? payload.amount, currency: payload.currency || 'USD', type: payload.type || 'one_time', provider: payload.provider || 'manual', status: 'pending' });
};
export const handleWebhook = async (payload) => {
  if (!payload.providerPaymentId) throw new AppError('providerPaymentId is required', 400);
  return Payment.findOneAndUpdate({ providerPaymentId: payload.providerPaymentId }, { status: payload.status }, { new: true });
};