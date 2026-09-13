import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Course from '../models/Course.js';
import Teacher from '../models/Teacher.js';
import Payment from '../models/Payment.js';
import ContactMessage from '../models/ContactMessage.js';

export const listStudents = async (query = {}) => {
  const filter = { role: 'student' };
  if (query.search) filter.$or = [{ name: { $regex: query.search, $options: 'i' } }, { email: { $regex: query.search, $options: 'i' } }];
  const page = Math.max(Number(query.page) || 1, 1); const limit = Math.min(Number(query.limit) || 20, 100);
  const [items, total] = await Promise.all([User.find(filter).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), User.countDocuments(filter)]);
  return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } };
};

export const updateStudent = (id, isActive) => User.findOneAndUpdate({ _id: id, role: 'student' }, { isActive }, { new: true }).select('-password');

export const report = async () => {
  const [students, teachers, courses, bookings, payments, revenue] = await Promise.all([
    User.countDocuments({ role: 'student' }), Teacher.countDocuments(), Course.countDocuments({ isActive: true }), Booking.countDocuments(), Payment.countDocuments({ status: 'paid' }), Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: '$currency', total: { $sum: '$amount' } } }]),
  ]);
  return { students, teachers, courses, bookings, payments, revenue };
};

export const contactMessages = (query) => ContactMessage.find(query).sort({ createdAt: -1 }).limit(100);