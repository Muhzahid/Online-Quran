import { Router } from 'express';
import * as courseController from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createCourseValidation,
  updateCourseValidation,
} from '../validators/contentValidators.js';

const router = Router();

router.get('/', courseController.getCourses);
router.get('/admin/list', protect, authorize('admin'), courseController.getAdminCourses);
router.get('/:slug', courseController.getCourse);

router.post(
  '/',
  protect,
  authorize('admin'),
  createCourseValidation,
  courseController.createCourse
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  updateCourseValidation,
  courseController.updateCourse
);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  courseController.deleteCourse
);

export default router;
