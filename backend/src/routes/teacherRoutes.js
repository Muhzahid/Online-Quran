import { Router } from 'express';
import * as teacherController from '../controllers/teacherController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { createUploader } from '../middleware/uploadMiddleware.js';

const router = Router();
const uploadDocument = createUploader({
  folder: 'documents',
  type: 'document',
  maxSizeMb: 8,
});

router.get('/', teacherController.getTeachers);

router.get(
  '/me/profile',
  protect,
  authorize('teacher'),
  teacherController.getMyProfile
);
router.put(
  '/me/profile',
  protect,
  authorize('teacher'),
  teacherController.updateMyProfile
);
router.put(
  '/me/availability',
  protect,
  authorize('teacher'),
  teacherController.updateMyAvailability
);
router.post(
  '/me/documents',
  protect,
  authorize('teacher'),
  uploadDocument.single('document'),
  teacherController.uploadDocument
);
router.post(
  '/me/submit-application',
  protect,
  authorize('teacher'),
  teacherController.submitApplication
);

router.get(
  '/admin/list',
  protect,
  authorize('admin'),
  teacherController.getAdminTeachers
);
router.get(
  '/admin/applications',
  protect,
  authorize('admin'),
  teacherController.getApplications
);

router.put(
  '/:id/approve',
  protect,
  authorize('admin'),
  teacherController.approveTeacher
);
router.put(
  '/:id/reject',
  protect,
  authorize('admin'),
  teacherController.rejectTeacher
);
router.put(
  '/:id/suspend',
  protect,
  authorize('admin'),
  teacherController.suspendTeacher
);

router.get('/:id', teacherController.getTeacher);

export default router;
