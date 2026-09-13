import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import * as controller from '../controllers/notificationController.js';

const router = Router();
router.use(protect);
router.get('/', controller.list);
router.post('/read-all', controller.markAllRead);
router.post('/:id/read', controller.markRead);
export default router;