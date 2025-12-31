export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdBy: {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  assignedTo?: {
    _id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  tags: string[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  assignedTo?: string;
  tags?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string;
  tags?: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}