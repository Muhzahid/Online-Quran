import { Router } from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidators.js';
import * as controller from '../controllers/paymentController.js';

const router = Router();
router.get('/', protect, controller.list);
router.post('/', protect, authorize('student'), body('courseId').optional().isMongoId(), body('amount').optional().isFloat({ min: 0 }), body('type').optional().isIn(['one_time', 'subscription']), validate, controller.create);
router.post('/webhook', body('providerPaymentId').notEmpty(), body('status').isIn(['pending', 'paid', 'failed', 'refunded']), validate, controller.webhook);
export default router;