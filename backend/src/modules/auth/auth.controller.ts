import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types/common.types';
import { AuthService } from './auth.service';
import { ApiResponseUtil } from '../../shared/utils/apiResponse';

export class AuthController {
  private authService = new AuthService();

  register = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return ApiResponseUtil.success(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Registration successful',
        201
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ApiResponseUtil.success(res, {
        user: result.user,
        accessToken: result.accessToken,
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return ApiResponseUtil.error(res, 'Refresh token not found', 401);
      }

      const result = await this.authService.refreshToken(refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return ApiResponseUtil.success(res, {
        accessToken: result.accessToken,
      }, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('refreshToken');
      return ApiResponseUtil.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.getMe(req.user!.id);
      return ApiResponseUtil.success(res, user);
    } catch (error) {
      next(error);
    }
  };
}