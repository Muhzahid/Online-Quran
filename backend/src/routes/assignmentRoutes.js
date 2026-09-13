import { Router } from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidators.js';
import * as controller from '../controllers/assignmentController.js';

const router = Router();
router.use(protect);
router.get('/', authorize('student', 'teacher'), controller.list);
router.post('/', authorize('teacher'), body('title').notEmpty(), body('instructions').notEmpty(), body('studentId').isMongoId(), body('courseId').isMongoId(), body('dueDate').optional().isISO8601(), validate, controller.create);
router.post('/:id/submit', authorize('student'), body('answer').trim().notEmpty(), validate, controller.submit);
router.put('/:id/submissions/:submissionId', authorize('teacher'), body('grade').isFloat({ min: 0, max: 100 }), body('feedback').optional().isString(), validate, controller.grade);
export default router;