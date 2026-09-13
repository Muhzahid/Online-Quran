import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import { AppError } from '../utils/ApiResponse.js';

export const listProgress = async (studentId) => {
  return Progress.find({ studentId }).populate('courseId', 'title slug lessons').sort({ updatedAt: -1 });
};

export const updateProgress = async (studentId, courseId, payload) => {
  const course = await Course.findOne({ _id: courseId, isActive: true });
  if (!course) throw new AppError('Course not found', 404);
  const lesson = course.lessons.id(payload.lessonId);
  if (!lesson) throw new AppError('Lesson not found in this course', 404);
  const progress = await Progress.findOneAndUpdate(
    { studentId, courseId },
    { $setOnInsert: { studentId, courseId }, $set: { notes: payload.notes || '' } },
    { new: true, upsert: true, runValidators: true }
  );
  const existing = progress.lessons.find((item) => item.lessonId.toString() === payload.lessonId);
  if (existing) {
    existing.completed = Boolean(payload.completed);
    existing.completedAt = existing.completed ? new Date() : undefined;
  } else {
    progress.lessons.push({ lessonId: payload.lessonId, completed: Boolean(payload.completed), completedAt: payload.completed ? new Date() : undefined });
  }
  await progress.save();
  return progress.populate('courseId', 'title slug lessons');
};