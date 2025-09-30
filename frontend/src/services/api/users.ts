import api from './base';
import type {UserInfo} from './auth';

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  username: string;
  email: string;
  role: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

export const userAPI = {
  // Authentication
  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Admin User Management
  getUsers: async (): Promise<UserInfo[]> => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  createUser: async (userData: CreateUserRequest): Promise<UserInfo> => {
    const response = await api.post('/api/admin/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: UpdateUserRequest): Promise<UserInfo> => {
    const response = await api.put(`/api/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`);
  },

  changeUserPassword: async (id: number, passwordData: ChangePasswordRequest): Promise<void> => {
    await api.put(`/api/admin/users/${id}/password`, passwordData);
  },
};
