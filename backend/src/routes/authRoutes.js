import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  verifyEmailValidation,
} from '../validators/authValidators.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts, please try again later',
    errors: [],
  },
});

router.use(authLimiter);

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.post('/verify-email', verifyEmailValidation, authController.verifyEmail);
router.post(
  '/forgot-password',
  forgotPasswordValidation,
  authController.forgotPassword
);
router.post(
  '/reset-password',
  resetPasswordValidation,
  authController.resetPassword
);
router.post(
  '/resend-verification',
  protect,
  authController.resendVerification
);

export default router;
