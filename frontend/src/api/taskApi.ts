import axiosInstance from './axios.config';
import type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskStats,
} from '../types/task.types';
import type { ApiResponse, PaginatedResponse } from '../types/api.types';

export const taskApi = {
  getTasks: async (params?: any): Promise<PaginatedResponse<Task>> => {
    const response = await axiosInstance.get<PaginatedResponse<Task>>(
      '/tasks',
      { params }
    );
    return response.data;
  },

  getTaskById: async (id: string): Promise<Task> => {
    const response = await axiosInstance.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data!;
  },

  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await axiosInstance.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data!;
  },

  updateTask: async (id: string, data: UpdateTaskData): Promise<Task> => {
    const response = await axiosInstance.put<ApiResponse<Task>>(
      `/tasks/${id}`,
      data
    );
    return response.data.data!;
  },

  deleteTask: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tasks/${id}`);
  },

  updateTaskStatus: async (id: string, status: string): Promise<Task> => {
    const response = await axiosInstance.patch<ApiResponse<Task>>(
      `/tasks/${id}/status`,
      { status }
    );
    return response.data.data!;
  },

  updateTaskPriority: async (id: string, priority: string): Promise<Task> => {
    const response = await axiosInstance.patch<ApiResponse<Task>>(
      `/tasks/${id}/priority`,
      { priority }
    );
    return response.data.data!;
  },

  getTaskStats: async (): Promise<TaskStats> => {
    const response = await axiosInstance.get<ApiResponse<TaskStats>>(
      '/tasks/stats'
    );
    return response.data.data!;
  },
};