import { Router } from 'express';
import { body, query } from 'express-validator';
import * as classController from '../controllers/classController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidators.js';

const router = Router();

router.use(protect);
router.get('/', query('status').optional().isIn(['scheduled', 'completed', 'cancelled']), validate, classController.listClasses);
router.get('/:id', classController.getClass);
router.post(
  '/:id/attendance',
  authorize('student', 'teacher'),
  body('studentStatus').optional().isIn(['unmarked', 'present', 'absent', 'late']),
  body('teacherStatus').optional().isIn(['unmarked', 'present', 'absent', 'late']),
  body('notes').optional().isString().isLength({ max: 1000 }),
  validate,
  classController.upsertAttendance
);

export default router;