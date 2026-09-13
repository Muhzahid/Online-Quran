import Course from '../models/Course.js';
import { AppError } from '../utils/ApiResponse.js';
import { slugify } from '../utils/slugify.js';

export const listCourses = async ({ page = 1, limit = 20, level, search, activeOnly = true } = {}) => {
  const filter = {};
  if (activeOnly) filter.isActive = true;
  if (level && level !== 'all') filter.level = level;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Course.countDocuments(filter),
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

export const getCourseBySlug = async (slug) => {
  const course = await Course.findOne({ slug, isActive: true });
  if (!course) throw new AppError('Course not found', 404);
  return course;
};

export const getCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) throw new AppError('Course not found', 404);
  return course;
};

export const createCourse = async (payload) => {
  const slug = payload.slug || slugify(payload.title);
  const exists = await Course.findOne({ slug });
  if (exists) throw new AppError('Course slug already exists', 409);

  return Course.create({ ...payload, slug });
};

export const updateCourse = async (id, payload) => {
  const course = await Course.findById(id);
  if (!course) throw new AppError('Course not found', 404);

  if (payload.title && !payload.slug) {
    payload.slug = slugify(payload.title);
  }

  if (payload.slug && payload.slug !== course.slug) {
    const exists = await Course.findOne({ slug: payload.slug, _id: { $ne: id } });
    if (exists) throw new AppError('Course slug already exists', 409);
  }

  Object.assign(course, payload);
  await course.save();
  return course;
};

export const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) throw new AppError('Course not found', 404);
  return course;
};
