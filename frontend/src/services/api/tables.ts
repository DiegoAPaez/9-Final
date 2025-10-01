import api from './base';
import type {TableStateEnum} from "../../utils/tableValidation.ts";

export interface RestaurantTableDto {
  id: number;
  number: number;
  currentOrderId: number | null;
  tableState: TableStateEnum;
}

export interface CreateRestaurantTableRequest {
  number: number;
  tableState: TableStateEnum;
}

export interface UpdateRestaurantTableRequest {
  number?: number;
  currentOrderId?: number | null;
  tableState?: TableStateEnum;
}

export const tablesAPI = {
  // Admin Table Management
  getAllTables: async (): Promise<RestaurantTableDto[]> => {
    const response = await api.get('/api/admin/tables');
    return response.data;
  },

  getTableById: async (id: number): Promise<RestaurantTableDto> => {
    const response = await api.get(`/api/admin/tables/${id}`);
    return response.data;
  },

  getTableByNumber: async (number: number): Promise<RestaurantTableDto> => {
    const response = await api.get(`/api/admin/tables/number/${number}`);
    return response.data;
  },

  getTablesByState: async (state: TableStateEnum): Promise<RestaurantTableDto[]> => {
    const response = await api.get(`/api/admin/tables/state/${state}`);
    return response.data;
  },

  createTable: async (tableData: CreateRestaurantTableRequest): Promise<RestaurantTableDto> => {
    const response = await api.post('/api/admin/tables', tableData);
    return response.data;
  },

  updateTable: async (id: number, tableData: UpdateRestaurantTableRequest): Promise<RestaurantTableDto> => {
    const response = await api.put(`/api/admin/tables/${id}`, tableData);
    return response.data;
  },

  updateTableState: async (id: number, state: TableStateEnum): Promise<RestaurantTableDto> => {
    const response = await api.patch(`/api/admin/tables/${id}/state?state=${state}`);
    return response.data;
  },

  assignOrderToTable: async (tableId: number, orderId: number): Promise<void> => {
    await api.patch(`/api/admin/tables/${tableId}/assign-order/${orderId}`);
  },

  deleteTable: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/tables/${id}`);
  },

  // Public Table Access
  getPublicTables: async (): Promise<RestaurantTableDto[]> => {
    const response = await api.get('/api/tables');
    return response.data;
  },

  getPublicTableById: async (id: number): Promise<RestaurantTableDto> => {
    const response = await api.get(`/api/tables/${id}`);
    return response.data;
  },

  getPublicTableByNumber: async (number: number): Promise<RestaurantTableDto> => {
    const response = await api.get(`/api/tables/number/${number}`);
    return response.data;
  },

  getPublicTablesByState: async (state: TableStateEnum): Promise<RestaurantTableDto[]> => {
    const response = await api.get(`/api/tables/state/${state}`);
    return response.data;
  },

  updatePublicTableState: async (id: number, state: TableStateEnum): Promise<RestaurantTableDto> => {
    const response = await api.patch(`/api/tables/${id}/state?state=${state}`);
    return response.data;
  },

  assignPublicOrderToTable: async (tableId: number, orderId: number): Promise<RestaurantTableDto> => {
    const response = await api.patch(`/api/tables/${tableId}/assign-order/${orderId}`);
    return response.data;
  },
};
