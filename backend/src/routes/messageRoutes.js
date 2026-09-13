import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidators.js';
import * as controller from '../controllers/messageController.js';

const router = Router();
router.use(protect);
router.get('/', controller.conversations);
router.post('/', body('participantId').isMongoId(), validate, controller.create);
router.get('/:id', controller.messages);
router.post('/:id/messages', body('body').trim().notEmpty().isLength({ max: 5000 }), validate, controller.send);
export default router;