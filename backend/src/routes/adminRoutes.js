import { Router } from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidators.js';
import * as controller from '../controllers/adminController.js';

const router = Router();
router.use(protect, authorize('admin'));
router.get('/students', controller.students);
router.patch('/students/:id', body('isActive').isBoolean(), validate, controller.updateStudent);
router.get('/reports', controller.report);
router.get('/contact-messages', controller.contacts);
export default router;