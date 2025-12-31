import axiosInstance from './axios.config';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types/user.types';
import type { ApiResponse } from '../types/api.types';

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    return response.data.data!;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post<
      ApiResponse<{ accessToken: string }>
    >('/auth/refresh');
    return response.data.data!;
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },
};