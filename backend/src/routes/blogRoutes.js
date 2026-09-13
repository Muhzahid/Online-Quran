import { Router } from 'express';
import * as blogController from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { blogValidation } from '../validators/contentValidators.js';

const router = Router();

router.get('/', blogController.getPosts);
router.get('/admin/list', protect, authorize('admin'), blogController.getAdminPosts);
router.get('/:slug', blogController.getPost);

router.post(
  '/',
  protect,
  authorize('admin'),
  blogValidation,
  blogController.createPost
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  blogController.updatePost
);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  blogController.deletePost
);

export default router;
