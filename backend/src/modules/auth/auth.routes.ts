import { Router } from 'express';
import { AuthController } from './auth.controller';
import { registerValidation, loginValidation } from './auth.validation';
import { validateRequest } from '../../shared/middleware/validateRequest';
import { authenticate } from './auth.middleware';
import { authLimiter } from '../../shared/middleware/rateLimiter';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  authLimiter,
  registerValidation,
  validateRequest,
  authController.register
);

router.post(
  '/login',
  authLimiter,
  loginValidation,
  validateRequest,
  authController.login
);

router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;