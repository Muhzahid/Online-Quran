import Booking from '../models/Booking.js';
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { AppError } from '../utils/ApiResponse.js';
import { sendEmail } from './emailService.js';
import { createClassFromBooking, updateClassStatusFromBooking } from './classService.js';

const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const toMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const rangesOverlap = (aStart, aEnd, bStart, bEnd) =>
  aStart < bEnd && aEnd > bStart;

export const getAvailableSlots = async ({ teacherId, date, duration = 60 }) => {
  const teacher = await Teacher.findById(teacherId);
  if (!teacher || !teacher.isApproved || teacher.isSuspended) {
    throw new AppError('Teacher is not available for booking', 422);
  }

  const dayName = DAYS[new Date(`${date}T12:00:00`).getDay()];
  const daySlots = (teacher.availability || []).filter(
    (s) => s.day === dayName && !s.isOff
  );

  if (!daySlots.length) return [];

  const existing = await Booking.find({
    teacherId,
    date,
    status: { $in: ['pending', 'confirmed'] },
  });

  const slots = [];
  for (const window of daySlots) {
    let cursor = toMinutes(window.startTime);
    const end = toMinutes(window.endTime);
    while (cursor + duration <= end) {
      const startTime = `${String(Math.floor(cursor / 60)).padStart(2, '0')}:${String(cursor % 60).padStart(2, '0')}`;
      const endMins = cursor + duration;
      const endTime = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;

      const conflict = existing.some((b) =>
        rangesOverlap(
          cursor,
          endMins,
          toMinutes(b.startTime),
          toMinutes(b.endTime)
        )
      );

      if (!conflict) {
        slots.push({ startTime, endTime });
      }
      cursor += duration;
    }
  }

  return slots;
};

export const createBooking = async (payload, studentId) => {
  const { teacherId, courseId, date, startTime, endTime, timezone, type, notes } =
    payload;

  const [teacher, course, student] = await Promise.all([
    Teacher.findById(teacherId).populate('userId', 'name email'),
    Course.findById(courseId),
    User.findById(studentId),
  ]);

  if (!teacher) throw new AppError('Teacher not found', 404);
  if (!teacher.isApproved || teacher.isSuspended) {
    throw new AppError('Teacher is not approved to conduct classes', 422);
  }
  if (!course || !course.isActive) throw new AppError('Course not found', 404);
  if (!student) throw new AppError('Student not found', 404);

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  if (start >= end) throw new AppError('Invalid time range', 400);

  const dayName = DAYS[new Date(`${date}T12:00:00`).getDay()];
  const withinAvailability = (teacher.availability || []).some((slot) => {
    if (slot.day !== dayName || slot.isOff) return false;
    return start >= toMinutes(slot.startTime) && end <= toMinutes(slot.endTime);
  });

  if (!withinAvailability) {
    throw new AppError('Selected time is outside teacher availability', 422);
  }

  const overlapping = await Booking.findOne({
    teacherId,
    date,
    status: { $in: ['pending', 'confirmed'] },
    $expr: {
      $and: [
        { $lt: ['$startTime', endTime] },
        { $gt: ['$endTime', startTime] },
      ],
    },
  });

  // String HH:mm comparison works lexicographically for zero-padded times
  const existing = await Booking.find({
    teacherId,
    date,
    status: { $in: ['pending', 'confirmed'] },
  });

  const hasOverlap = existing.some((b) =>
    rangesOverlap(start, end, toMinutes(b.startTime), toMinutes(b.endTime))
  );

  if (hasOverlap || overlapping) {
    throw new AppError(
      'This time slot is already booked. Please choose another slot.',
      409
    );
  }

  const booking = await Booking.create({
    studentId,
    teacherId,
    courseId,
    date,
    startTime,
    endTime,
    timezone: timezone || teacher.timezone || 'UTC',
    type: type || 'trial',
    status: 'pending',
    notes: notes || '',
  });

  const populated = await Booking.findById(booking._id)
    .populate('studentId', 'name email')
    .populate({ path: 'teacherId', populate: { path: 'userId', select: 'name email' } })
    .populate('courseId', 'title slug');

  await sendEmail({
    to: student.email,
    subject: 'Trial booking received — Quran Academy',
    html: `<p>Hi ${student.name},</p><p>Your ${populated.type} booking for ${course.title} on ${date} at ${startTime} is pending confirmation.</p>`,
    text: `Booking pending for ${course.title} on ${date} at ${startTime}`,
  });

  if (teacher.userId?.email) {
    await sendEmail({
      to: teacher.userId.email,
      subject: 'New booking request — Quran Academy',
      html: `<p>Hi ${teacher.userId.name},</p><p>You have a new ${populated.type} booking request from ${student.name} on ${date} at ${startTime}.</p>`,
      text: `New booking from ${student.name} on ${date} at ${startTime}`,
    });
  }

  return populated;
};

export const listBookings = async (user, query = {}) => {
  const filter = {};
  if (user.role === 'student') filter.studentId = user.id;
  if (user.role === 'teacher') {
    const teacher = await Teacher.findOne({ userId: user.id });
    if (!teacher) return { items: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } };
    filter.teacherId = teacher._id;
  }
  if (query.status) filter.status = query.status;
  if (query.type) filter.type = query.type;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .populate('studentId', 'name email')
      .populate({ path: 'teacherId', populate: { path: 'userId', select: 'name email' } })
      .populate('courseId', 'title slug')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  return {
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  };
};

export const getBookingById = async (id, user) => {
  const booking = await Booking.findById(id)
    .populate('studentId', 'name email')
    .populate({ path: 'teacherId', populate: { path: 'userId', select: 'name email' } })
    .populate('courseId', 'title slug');

  if (!booking) throw new AppError('Booking not found', 404);

  if (user.role === 'student' && booking.studentId._id.toString() !== user.id) {
    throw new AppError('Access denied', 403);
  }
  if (user.role === 'teacher') {
    const teacher = await Teacher.findOne({ userId: user.id });
    if (!teacher || booking.teacherId._id.toString() !== teacher._id.toString()) {
      throw new AppError('Access denied', 403);
    }
  }

  return booking;
};

export const confirmBooking = async (id, user) => {
  const booking = await getBookingById(id, user);
  if (!['teacher', 'admin'].includes(user.role)) {
    throw new AppError('Only teachers or admins can confirm bookings', 403);
  }
  if (booking.status !== 'pending') {
    throw new AppError('Only pending bookings can be confirmed', 422);
  }

  booking.status = 'confirmed';
  if (!booking.meetingUrl) {
    booking.meetingUrl = `https://meet.google.com/lookup/${booking._id.toString().slice(-10)}`;
  }
  await booking.save();
  await createClassFromBooking(booking);

  await sendEmail({
    to: booking.studentId.email,
    subject: 'Booking confirmed — Quran Academy',
    html: `<p>Your class on ${booking.date} at ${booking.startTime} is confirmed.</p><p>Meeting link: <a href="${booking.meetingUrl}">${booking.meetingUrl}</a></p>`,
    text: `Booking confirmed. Meeting: ${booking.meetingUrl}`,
  });

  return booking;
};

export const cancelBooking = async (id, user) => {
  const booking = await getBookingById(id, user);
  if (['completed', 'cancelled'].includes(booking.status)) {
    throw new AppError('Booking cannot be cancelled', 422);
  }
  booking.status = 'cancelled';
  await booking.save();
  await updateClassStatusFromBooking(booking);

  await sendEmail({
    to: booking.studentId.email,
    subject: 'Booking cancelled — Quran Academy',
    html: `<p>Your booking on ${booking.date} at ${booking.startTime} was cancelled.</p>`,
    text: `Booking cancelled for ${booking.date} at ${booking.startTime}`,
  });

  return booking;
};

export const completeBooking = async (id, user) => {
  const booking = await getBookingById(id, user);
  if (!['teacher', 'admin'].includes(user.role)) {
    throw new AppError('Only teachers or admins can complete bookings', 403);
  }
  if (booking.status !== 'confirmed') {
    throw new AppError('Only confirmed bookings can be completed', 422);
  }
  booking.status = 'completed';
  await booking.save();
  await updateClassStatusFromBooking(booking);
  return booking;
};

export const updateBooking = async (id, user, payload) => {
  const booking = await getBookingById(id, user);
  if (user.role !== 'admin' && user.role !== 'teacher') {
    throw new AppError('Not allowed', 403);
  }
  if (payload.meetingUrl !== undefined) booking.meetingUrl = payload.meetingUrl;
  if (payload.notes !== undefined) booking.notes = payload.notes;
  if (payload.status && user.role === 'admin') booking.status = payload.status;
  await booking.save();
  if (['completed', 'cancelled', 'confirmed'].includes(payload.status)) {
    if (payload.status === 'confirmed') await createClassFromBooking(booking);
    else await updateClassStatusFromBooking(booking);
  }
  return booking;
};

export const deleteBooking = async (id, user) => {
  if (user.role !== 'admin') throw new AppError('Admin only', 403);
  const booking = await Booking.findByIdAndDelete(id);
  if (!booking) throw new AppError('Booking not found', 404);
  return booking;
};
