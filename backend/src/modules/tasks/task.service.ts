import { Task, ITask } from './task.model';
import { AppError } from '../../shared/middleware/errorHandler';
import { PaginationUtil } from '../../shared/utils/pagination';

export class TaskService {
  async createTask(
    taskData: Partial<ITask>,
    userId: string
  ): Promise<ITask> {
    const task = await Task.create({
      ...taskData,
      createdBy: userId,
    });

    return task.populate('createdBy assignedTo', 'username email firstName lastName');
  }

  async getTasks(
    userId: string,
    userRole: string,
    query: {
      page?: string;
      limit?: string;
      status?: string;
      priority?: string;
      search?: string;
      sortBy?: string;
      order?: 'asc' | 'desc';
    }
  ): Promise<{ tasks: ITask[]; total: number; page: number; limit: number }> {
    const { skip, limit, page } = PaginationUtil.getPaginationParams(
      query.page,
      query.limit
    );

    // Build filter
    const filter: any = {};

    // Regular users see only their tasks
    if (userRole !== 'admin') {
      filter.$or = [{ createdBy: userId }, { assignedTo: userId }];
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    // Build sort
    const sortField = query.sortBy || 'createdAt';
    const sortOrder = query.order === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrder };

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy assignedTo', 'username email firstName lastName')
        .lean(),
      Task.countDocuments(filter),
    ]);

    return { tasks, total, page, limit };
  }

  async getTaskById(taskId: string, userId: string, userRole: string): Promise<ITask> {
    const task = await Task.findById(taskId).populate(
      'createdBy assignedTo',
      'username email firstName lastName'
    );

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check access rights
    if (
      userRole !== 'admin' &&
      task.createdBy._id.toString() !== userId &&
      task.assignedTo?._id.toString() !== userId
    ) {
      throw new AppError('Access denied', 403);
    }

    return task;
  }

  async updateTask(
    taskId: string,
    userId: string,
    userRole: string,
    updateData: Partial<ITask>
  ): Promise<ITask> {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Check permissions
    if (userRole !== 'admin' && task.createdBy.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    Object.assign(task, updateData);
    await task.save();

    return task.populate('createdBy assignedTo', 'username email firstName lastName');
  }

  async deleteTask(taskId: string, userId: string, userRole: string): Promise<void> {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    if (userRole !== 'admin' && task.createdBy.toString() !== userId) {
      throw new AppError('Access denied', 403);
    }

    await task.deleteOne();
  }

  async updateTaskStatus(
    taskId: string,
    userId: string,
    userRole: string,
    status: string
  ): Promise<ITask> {
    return this.updateTask(taskId, userId, userRole, { status } as Partial<ITask>);
  }

  async updateTaskPriority(
    taskId: string,
    userId: string,
    userRole: string,
    priority: string
  ): Promise<ITask> {
    return this.updateTask(taskId, userId, userRole, { priority } as Partial<ITask>);
  }

  async getTaskStats(userId: string, userRole: string) {
    const filter: any = {};
    
    if (userRole !== 'admin') {
      filter.$or = [{ createdBy: userId }, { assignedTo: userId }];
    }

    const stats = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          in_progress: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] },
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] },
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] },
          },
        },
      },
    ]);

    return stats[0] || {
      total: 0,
      pending: 0,
      in_progress: 0,
      completed: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
    };
  }
}