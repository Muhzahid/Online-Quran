import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import teacherRoutes from './teacherRoutes.js';
import contactRoutes from './contactRoutes.js';
import blogRoutes from './blogRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import studentRoutes from './studentRoutes.js';
import classRoutes from './classRoutes.js';
import progressRoutes from './progressRoutes.js';
import assignmentRoutes from './assignmentRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import messageRoutes from './messageRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/teachers', teacherRoutes);
router.use('/contact', contactRoutes);
router.use('/blog', blogRoutes);
router.use('/bookings', bookingRoutes);
router.use('/students', studentRoutes);
router.use('/classes', classRoutes);
router.use('/progress', progressRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/messages', messageRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

export default router;
