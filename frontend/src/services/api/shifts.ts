import api from './base';

export interface ShiftDto {
  id: number;
  startDate: string;
  endDate: string;
  userId: number;
}

export interface CreateShiftRequest {
  startDate: string;
  endDate: string;
  userId: number;
}

export interface UpdateShiftRequest {
  startDate?: string;
  endDate?: string;
  userId?: number;
}

export const shiftsAPI = {
  // Admin Shift Management
  getAllShifts: async (): Promise<ShiftDto[]> => {
    const response = await api.get('/api/admin/shifts');
    return response.data;
  },

  getShiftById: async (id: number): Promise<ShiftDto> => {
    const response = await api.get(`/api/admin/shifts/${id}`);
    return response.data;
  },

  getShiftsByUser: async (userId: number): Promise<ShiftDto[]> => {
    const response = await api.get(`/api/admin/shifts/user/${userId}`);
    return response.data;
  },

  createShift: async (shiftData: CreateShiftRequest): Promise<ShiftDto> => {
    const response = await api.post('/api/admin/shifts', shiftData);
    return response.data;
  },

  updateShift: async (id: number, shiftData: UpdateShiftRequest): Promise<ShiftDto> => {
    const response = await api.put(`/api/admin/shifts/${id}`, shiftData);
    return response.data;
  },

  deleteShift: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/shifts/${id}`);
  },

  // Employee Shift Access
  getMyShifts: async (): Promise<ShiftDto[]> => {
    const response = await api.get('/api/shifts/my-shifts');
    return response.data;
  },
};
