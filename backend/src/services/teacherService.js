import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import { AppError } from '../utils/ApiResponse.js';
import {
  sendEmail,
} from './emailService.js';
import config from '../config/index.js';

const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const validateAvailability = (availability = []) => {
  const byDay = {};

  for (const slot of availability) {
    if (slot.isOff) continue;
    if (!slot.startTime || !slot.endTime) {
      throw new AppError('Availability slots require start and end time', 422);
    }
    const start = timeToMinutes(slot.startTime);
    const end = timeToMinutes(slot.endTime);
    if (start >= end) {
      throw new AppError(
        `Invalid time range for ${slot.day}: start must be before end`,
        422
      );
    }
    if (!byDay[slot.day]) byDay[slot.day] = [];
    for (const existing of byDay[slot.day]) {
      const overlaps = start < existing.end && end > existing.start;
      if (overlaps) {
        throw new AppError(
          `Overlapping availability on ${slot.day}`,
          422
        );
      }
    }
    byDay[slot.day].push({ start, end });
  }
};

export const listPublicTeachers = async (query = {}) => {
  const {
    page = 1,
    limit = 12,
    name,
    country,
    gender,
    language,
    specialization,
    experience,
    rating,
    minRate,
    maxRate,
    available,
  } = query;

  const filter = {
    isApproved: true,
    isSuspended: false,
    applicationStatus: 'approved',
  };

  if (country) filter.country = new RegExp(country, 'i');
  if (gender) filter.gender = gender;
  if (language) filter.languages = { $in: [new RegExp(language, 'i')] };
  if (specialization) {
    filter.specialization = { $in: [new RegExp(specialization, 'i')] };
  }
  if (experience) filter.experience = { $gte: Number(experience) };
  if (rating) filter.rating = { $gte: Number(rating) };
  if (minRate || maxRate) {
    filter.hourlyRate = {};
    if (minRate) filter.hourlyRate.$gte = Number(minRate);
    if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
  }
  if (available === 'true') {
    filter.availability = { $elemMatch: { isOff: false } };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Teacher.find(filter)
      .populate('userId', 'name email avatar phone isActive')
      .sort({ rating: -1, experience: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Teacher.countDocuments(filter),
  ]);

  let filtered = items.filter((t) => t.userId && t.userId.isActive !== false);

  if (name) {
    const re = new RegExp(name, 'i');
    filtered = filtered.filter((t) => re.test(t.userId?.name || ''));
  }

  return {
    items: filtered,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: name ? filtered.length : total,
      pages: Math.ceil((name ? filtered.length : total) / Number(limit)) || 1,
    },
  };
};

export const getPublicTeacherById = async (id) => {
  const teacher = await Teacher.findOne({
    _id: id,
    isApproved: true,
    isSuspended: false,
    applicationStatus: 'approved',
  }).populate('userId', 'name email avatar phone');

  if (!teacher || !teacher.userId) {
    throw new AppError('Teacher not found', 404);
  }

  return teacher;
};

export const getOrCreateTeacherProfile = async (userId) => {
  let teacher = await Teacher.findOne({ userId }).populate(
    'userId',
    'name email avatar phone'
  );

  if (!teacher) {
    teacher = await Teacher.create({ userId });
    teacher = await Teacher.findById(teacher._id).populate(
      'userId',
      'name email avatar phone'
    );
  }

  return teacher;
};

export const updateTeacherProfile = async (userId, payload) => {
  const teacher = await getOrCreateTeacherProfile(userId);

  const allowed = [
    'bio',
    'qualification',
    'experience',
    'languages',
    'specialization',
    'hourlyRate',
    'country',
    'gender',
    'timezone',
  ];

  for (const key of allowed) {
    if (payload[key] !== undefined) {
      teacher[key] = payload[key];
    }
  }

  if (payload.name || payload.phone) {
    const user = await User.findById(userId);
    if (payload.name) user.name = payload.name;
    if (payload.phone !== undefined) user.phone = payload.phone;
    await user.save();
  }

  await teacher.save();
  return Teacher.findById(teacher._id).populate(
    'userId',
    'name email avatar phone'
  );
};

export const updateAvailability = async (userId, availability, timezone) => {
  validateAvailability(availability);
  const teacher = await getOrCreateTeacherProfile(userId);
  teacher.availability = availability;
  if (timezone) teacher.timezone = timezone;
  await teacher.save();
  return teacher;
};

export const addQualificationDocument = async (userId, document) => {
  const teacher = await getOrCreateTeacherProfile(userId);
  teacher.documents.push(document);
  await teacher.save();
  return teacher;
};

export const submitApplication = async (userId) => {
  const teacher = await getOrCreateTeacherProfile(userId);

  if (!teacher.bio || !teacher.qualification) {
    throw new AppError(
      'Complete bio and qualification before submitting application',
      422
    );
  }

  if (!teacher.documents.length) {
    throw new AppError(
      'Upload at least one qualification document before submitting',
      422
    );
  }

  if (teacher.applicationStatus === 'approved') {
    throw new AppError('Application already approved', 400);
  }

  teacher.applicationStatus = 'pending';
  teacher.rejectionReason = '';
  await teacher.save();

  const user = await User.findById(userId);
  await sendEmail({
    to: user.email,
    subject: 'Teacher application submitted — Quran Academy',
    html: `<p>Hi ${user.name},</p><p>Your teacher application has been submitted and is pending admin review.</p>`,
    text: `Hi ${user.name}, your teacher application is pending review.`,
  });

  return teacher;
};

export const listTeacherApplications = async ({
  page = 1,
  limit = 20,
  status = 'pending',
} = {}) => {
  const filter = {};
  if (status) filter.applicationStatus = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Teacher.find(filter)
      .populate('userId', 'name email phone avatar isActive')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Teacher.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

export const approveTeacher = async (teacherId) => {
  const teacher = await Teacher.findById(teacherId).populate('userId');
  if (!teacher) throw new AppError('Teacher not found', 404);

  teacher.isApproved = true;
  teacher.isSuspended = false;
  teacher.applicationStatus = 'approved';
  teacher.rejectionReason = '';
  await teacher.save();

  await sendEmail({
    to: teacher.userId.email,
    subject: 'Teacher application approved — Quran Academy',
    html: `<p>Hi ${teacher.userId.name},</p><p>Congratulations! Your teacher application has been approved. You can now set availability and receive bookings.</p>`,
    text: `Hi ${teacher.userId.name}, your teacher application has been approved.`,
  });

  return teacher;
};

export const rejectTeacher = async (teacherId, reason = '') => {
  const teacher = await Teacher.findById(teacherId).populate('userId');
  if (!teacher) throw new AppError('Teacher not found', 404);

  teacher.isApproved = false;
  teacher.applicationStatus = 'rejected';
  teacher.rejectionReason = reason || 'Application rejected by admin';
  await teacher.save();

  await sendEmail({
    to: teacher.userId.email,
    subject: 'Teacher application update — Quran Academy',
    html: `<p>Hi ${teacher.userId.name},</p><p>Your teacher application was not approved.</p><p>Reason: ${teacher.rejectionReason}</p>`,
    text: `Hi ${teacher.userId.name}, your application was rejected. Reason: ${teacher.rejectionReason}`,
  });

  return teacher;
};

export const suspendTeacher = async (teacherId, reason = '') => {
  const teacher = await Teacher.findById(teacherId).populate('userId');
  if (!teacher) throw new AppError('Teacher not found', 404);

  teacher.isSuspended = true;
  teacher.isApproved = false;
  teacher.applicationStatus = 'suspended';
  teacher.rejectionReason = reason || 'Account suspended';
  await teacher.save();

  return teacher;
};

export const listAllTeachersAdmin = async ({
  page = 1,
  limit = 20,
  search,
  status,
} = {}) => {
  const filter = {};
  if (status) filter.applicationStatus = status;

  const skip = (Number(page) - 1) * Number(limit);
  let items = await Teacher.find(filter)
    .populate('userId', 'name email phone avatar isActive')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  if (search) {
    const re = new RegExp(search, 'i');
    items = items.filter(
      (t) =>
        re.test(t.userId?.name || '') ||
        re.test(t.userId?.email || '') ||
        re.test(t.country || '')
    );
  }

  const total = await Teacher.countDocuments(filter);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

export { validateAvailability };
