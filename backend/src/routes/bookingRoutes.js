import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { body, query } from 'express-validator';
import { validate } from '../validators/authValidators.js';

const router = Router();

const createValidation = [
  body('teacherId').isMongoId().withMessage('Valid teacherId is required'),
  body('courseId').isMongoId().withMessage('Valid courseId is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('type').optional().isIn(['trial', 'regular']),
  validate,
];

router.get(
  '/slots',
  protect,
  query('teacherId').isMongoId(),
  query('date').notEmpty(),
  validate,
  bookingController.getSlots
);

router.post(
  '/',
  protect,
  authorize('student'),
  createValidation,
  bookingController.createBooking
);

router.get('/', protect, bookingController.getBookings);
router.get('/:id', protect, bookingController.getBooking);
router.put('/:id', protect, bookingController.updateBooking);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  bookingController.deleteBooking
);
router.post('/:id/confirm', protect, bookingController.confirmBooking);
router.post('/:id/cancel', protect, bookingController.cancelBooking);
router.post('/:id/complete', protect, bookingController.completeBooking);

export default router;
