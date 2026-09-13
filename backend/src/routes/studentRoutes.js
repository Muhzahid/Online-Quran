import { Router } from 'express';
import * as studentController from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.get(
  '/me/profile',
  protect,
  authorize('student'),
  studentController.getMyProfile
);
router.put(
  '/me/profile',
  protect,
  authorize('student'),
  studentController.updateMyProfile
);

export default router;
