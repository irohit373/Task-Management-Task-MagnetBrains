import { User, IUser } from '../users/user.model';
import { JWTUtil } from '../../shared/utils/jwt';
import { AppError } from '../../shared/middleware/errorHandler';

export class AuthService {
  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ user: Partial<IUser>; accessToken: string; refreshToken: string }> {
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Check if this is the first user - make them admin
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    const user = await User.create({
      ...userData,
      role: isFirstUser ? 'admin' : 'user',
    });

    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = JWTUtil.generateAccessToken(tokenPayload);
    const refreshToken = JWTUtil.generateRefreshToken(tokenPayload);

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();

    return { user: userResponse, accessToken, refreshToken };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: Partial<IUser>; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isActive) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = JWTUtil.generateAccessToken(tokenPayload);
    const refreshToken = JWTUtil.generateRefreshToken(tokenPayload);

    const { password: _, ...userResponse } = user.toObject();

    return { user: userResponse, accessToken, refreshToken };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = JWTUtil.verifyRefreshToken(refreshToken);

      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        throw new AppError('User not found', 404);
      }

      const tokenPayload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const newAccessToken = JWTUtil.generateAccessToken(tokenPayload);
      const newRefreshToken = JWTUtil.generateRefreshToken(tokenPayload);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async getMe(userId: string): Promise<Partial<IUser>> {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}