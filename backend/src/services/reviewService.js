import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Teacher from '../models/Teacher.js';
import { AppError } from '../utils/ApiResponse.js';

export const listReviews = async (query = {}) => {
  const filter = query.teacherId ? { teacherId: query.teacherId } : {};
  return Review.find(filter).populate('studentId', 'name').sort({ createdAt: -1 });
};

export const createReview = async (studentId, bookingId, payload) => {
  const booking = await Booking.findOne({ _id: bookingId, studentId, status: 'completed' });
  if (!booking) throw new AppError('Only completed bookings can be reviewed', 422);
  const existing = await Review.findOne({ bookingId });
  if (existing) throw new AppError('This booking has already been reviewed', 409);
  const review = await Review.create({ bookingId, studentId, teacherId: booking.teacherId, rating: payload.rating, comment: payload.comment || '' });
  const summary = await Review.aggregate([{ $match: { teacherId: booking.teacherId } }, { $group: { _id: '$teacherId', rating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }]);
  await Teacher.findByIdAndUpdate(booking.teacherId, { rating: summary[0]?.rating || 0, totalReviews: summary[0]?.totalReviews || 0 });
  return review.populate('studentId', 'name');
};