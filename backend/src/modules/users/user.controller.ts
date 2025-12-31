import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types/common.types';
import { UserService } from './user.service';
import { ApiResponseUtil } from '../../shared/utils/apiResponse';

export class UserController {
  private userService = new UserService();

  getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { users, total, page, limit } = await this.userService.getAllUsers(
        req.query as any
      );
      return ApiResponseUtil.paginated(res, users, page, limit, total);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return ApiResponseUtil.success(res, user);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      return ApiResponseUtil.success(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      return ApiResponseUtil.success(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.userService.deleteUser(req.params.id);
      return ApiResponseUtil.success(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}