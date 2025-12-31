import axiosInstance from './axios.config';
import type { User } from '../types/user.types';
import type { ApiResponse, PaginatedResponse } from '../types/api.types';

export const userApi = {
  getUsers: async (params?: any): Promise<PaginatedResponse<User>> => {
    const response = await axiosInstance.get<PaginatedResponse<User>>(
      '/users',
      { params }
    );
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.post<ApiResponse<User>>('/users', data);
    return response.data.data!;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put<ApiResponse<User>>(
      `/users/${id}`,
      data
    );
    return response.data.data!;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};