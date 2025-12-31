import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../auth/auth.middleware';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// GET all users - authenticated users can view (for task assignment)
router.get('/', userController.getAllUsers);

// Admin-only routes
router.post('/', authorize('admin'), userController.createUser);

router
  .route('/:id')
  .get(userController.getUserById)
  .put(authorize('admin'), userController.updateUser)
  .delete(authorize('admin'), userController.deleteUser);

export default router;