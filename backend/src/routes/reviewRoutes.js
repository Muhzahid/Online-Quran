import { Router } from 'express';
import { body, query } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidators.js';
import * as controller from '../controllers/reviewController.js';

const router = Router();
router.get('/', query('teacherId').optional().isMongoId(), validate, controller.list);
router.post('/', protect, authorize('student'), body('bookingId').isMongoId(), body('rating').isInt({ min: 1, max: 5 }), body('comment').optional().isString(), validate, controller.create);
export default router;