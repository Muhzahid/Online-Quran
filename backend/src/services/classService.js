import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';
import Teacher from '../models/Teacher.js';
import { AppError } from '../utils/ApiResponse.js';

const populateClass = (query) =>
  query
    .populate('studentId', 'name email')
    .populate({ path: 'teacherId', populate: { path: 'userId', select: 'name email' } })
    .populate('courseId', 'title slug');

const getTeacherId = async (userId) => {
  const teacher = await Teacher.findOne({ userId });
  if (!teacher) throw new AppError('Teacher profile not found', 404);
  return teacher._id;
};

export const listClasses = async (user, query = {}) => {
  const filter = {};
  if (user.role === 'student') filter.studentId = user.id;
  if (user.role === 'teacher') filter.teacherId = await getTeacherId(user.id);
  if (query.status) filter.status = query.status;

  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
  const [items, total] = await Promise.all([
    populateClass(Class.find(filter).sort({ date: 1, startTime: 1 }).skip((page - 1) * limit).limit(limit)).lean(),
    Class.countDocuments(filter),
  ]);

  const attendance = await Attendance.find({ classId: { $in: items.map((item) => item._id) } }).lean();
  const attendanceByClass = new Map(attendance.map((item) => [item.classId.toString(), item]));
  return {
    items: items.map((item) => ({ ...item, attendance: attendanceByClass.get(item._id.toString()) || null })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  };
};

export const getClass = async (id, user) => {
  const item = await populateClass(Class.findById(id));
  if (!item) throw new AppError('Class not found', 404);
  if (user.role === 'student' && item.studentId._id.toString() !== user.id) {
    throw new AppError('Access denied', 403);
  }
  if (user.role === 'teacher') {
    const teacherId = await getTeacherId(user.id);
    if (item.teacherId._id.toString() !== teacherId.toString()) throw new AppError('Access denied', 403);
  }
  const attendance = await Attendance.findOne({ classId: item._id });
  return { ...item.toObject(), attendance };
};

export const upsertAttendance = async (classId, user, payload) => {
  const item = await getClass(classId, user);
  const isTeacher = user.role === 'teacher';
  const update = { notes: payload.notes || '', markedBy: user.id };
  if (isTeacher && payload.teacherStatus) update.teacherStatus = payload.teacherStatus;
  if (!isTeacher && payload.studentStatus) update.studentStatus = payload.studentStatus;
  return Attendance.findOneAndUpdate(
    { classId: item._id },
    { $set: update, $setOnInsert: { classId: item._id } },
    { new: true, upsert: true, runValidators: true }
  );
};

export const createClassFromBooking = async (booking) => {
  const studentId = booking.studentId?._id || booking.studentId;
  const teacherId = booking.teacherId?._id || booking.teacherId;
  const courseId = booking.courseId?._id || booking.courseId;
  return Class.findOneAndUpdate(
    { bookingId: booking._id },
    {
      $set: {
        studentId,
        teacherId,
        courseId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        timezone: booking.timezone,
        type: booking.type,
        meetingUrl: booking.meetingUrl,
        status: 'scheduled',
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

export const updateClassStatusFromBooking = async (booking) => {
  const status = booking.status === 'completed' ? 'completed' : booking.status === 'cancelled' ? 'cancelled' : 'scheduled';
  await Class.findOneAndUpdate({ bookingId: booking._id }, { status, meetingUrl: booking.meetingUrl });
};