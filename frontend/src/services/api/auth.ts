import api from './base';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  csrfToken: string;
  message: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
};
