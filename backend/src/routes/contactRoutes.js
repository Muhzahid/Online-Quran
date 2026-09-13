import { Router } from 'express';
import * as contactController from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { contactValidation } from '../validators/contentValidators.js';

const router = Router();

router.post('/', contactValidation, contactController.submitContact);
router.get(
  '/',
  protect,
  authorize('admin'),
  contactController.getContactMessages
);
router.patch(
  '/:id',
  protect,
  authorize('admin'),
  contactController.updateContactMessage
);

export default router;
