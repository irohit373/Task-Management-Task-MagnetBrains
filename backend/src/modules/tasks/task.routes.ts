import { Router } from 'express';
import { TaskController } from './task.controller';
import {
  createTaskValidation,
  updateTaskValidation,
  taskQueryValidation,
} from './task.validation';
import { validateRequest } from '../../shared/middleware/validateRequest';
import { authenticate } from '../auth/auth.middleware';

const router = Router();
const taskController = new TaskController();

// All routes require authentication
router.use(authenticate);

router.get('/stats', taskController.getTaskStats);

router
  .route('/')
  .get(taskQueryValidation, validateRequest, taskController.getTasks)
  .post(createTaskValidation, validateRequest, taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTaskById)
  .put(updateTaskValidation, validateRequest, taskController.updateTask)
  .delete(taskController.deleteTask);

router.patch('/:id/status', taskController.updateTaskStatus);
router.patch('/:id/priority', taskController.updateTaskPriority);

export default router;