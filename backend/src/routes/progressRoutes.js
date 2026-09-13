import { Router } from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidators.js';
import * as controller from '../controllers/progressController.js';

const router = Router();
router.use(protect, authorize('student'));
router.get('/', controller.list);
router.put('/:courseId', body('lessonId').isMongoId(), body('completed').isBoolean(), body('notes').optional().isString(), validate, controller.update);
export default router;