import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types/common.types';
import { TaskService } from './task.service';
import { ApiResponseUtil } from '../../shared/utils/apiResponse';

export class TaskController {
  private taskService = new TaskService();

  createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.createTask(req.body, req.user!.id);
      return ApiResponseUtil.success(res, task, 'Task created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { tasks, total, page, limit } = await this.taskService.getTasks(
        req.user!.id,
        req.user!.role,
        req.query as any
      );
      return ApiResponseUtil.paginated(res, tasks, page, limit, total);
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.getTaskById(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      return ApiResponseUtil.success(res, task);
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.updateTask(
        req.params.id,
        req.user!.id,
        req.user!.role,
        req.body
      );
      return ApiResponseUtil.success(res, task, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.taskService.deleteTask(req.params.id, req.user!.id, req.user!.role);
      return ApiResponseUtil.success(res, null, 'Task deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  updateTaskStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.updateTaskStatus(
        req.params.id,
        req.user!.id,
        req.user!.role,
        req.body.status
      );
      return ApiResponseUtil.success(res, task, 'Task status updated');
    } catch (error) {
      next(error);
    }
  };

  updateTaskPriority = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const task = await this.taskService.updateTaskPriority(
        req.params.id,
        req.user!.id,
        req.user!.role,
        req.body.priority
      );
      return ApiResponseUtil.success(res, task, 'Task priority updated');
    } catch (error) {
      next(error);
    }
  };

  getTaskStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.taskService.getTaskStats(
        req.user!.id,
        req.user!.role
      );
      return ApiResponseUtil.success(res, stats);
    } catch (error) {
      next(error);
    }
  };
}