import { User, IUser } from './user.model';
import { AppError } from '../../shared/middleware/errorHandler';
import { PaginationUtil } from '../../shared/utils/pagination';

export class UserService {
  async getAllUsers(query: {
    page?: string;
    limit?: string;
    search?: string;
  }): Promise<{ users: IUser[]; total: number; page: number; limit: number }> {
    const { skip, limit, page } = PaginationUtil.getPaginationParams(
      query.page,
      query.limit
    );

    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { username: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).select('-password').lean(),
      User.countDocuments(filter),
    ]);

    return { users, total, page, limit };
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async createUser(userData: Partial<IUser>): Promise<Partial<IUser>> {
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const user = await User.create(userData);
    const { password: _, ...userResponse } = user.toObject();

    return userResponse;
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    // Don't allow password updates through this method
    const { password, ...safeUpdateData } = updateData;

    const user = await User.findByIdAndUpdate(userId, safeUpdateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }
  }
}