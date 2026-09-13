import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as courseService from '../services/courseService.js';

export const getCourses = asyncHandler(async (req, res) => {
  const data = await courseService.listCourses({
    ...req.query,
    activeOnly: true,
  });
  sendSuccess(res, { message: 'Courses fetched', data });
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseBySlug(req.params.slug);
  sendSuccess(res, { message: 'Course fetched', data: { course } });
});

export const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Course created',
    data: { course },
  });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  sendSuccess(res, { message: 'Course updated', data: { course } });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id);
  sendSuccess(res, { message: 'Course deleted', data: null });
});

export const getAdminCourses = asyncHandler(async (req, res) => {
  const data = await courseService.listCourses({
    ...req.query,
    activeOnly: false,
  });
  sendSuccess(res, { message: 'Courses fetched', data });
});
