import api from './base';

export interface AllergenDto {
  id: number;
  name: string;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export interface OrderStateDto {
  id: number;
  name: string;
}

export interface PaymentMethodDto {
  id: number;
  name: string;
}

export interface PaymentStatusDto {
  id: number;
  name: string;
}

export interface TableStateDto {
  id: number;
  name: string;
}

export const referenceDataAPI = {
  getAllergens: async (): Promise<AllergenDto[]> => {
    const response = await api.get('/api/allergens');
    return response.data;
  },

  getCategories: async (): Promise<CategoryDto[]> => {
    const response = await api.get('/api/categories');
    return response.data;
  },

  getOrderStates: async (): Promise<OrderStateDto[]> => {
    const response = await api.get('/api/order-states');
    return response.data;
  },

  getPaymentMethods: async (): Promise<PaymentMethodDto[]> => {
    const response = await api.get('/api/payment-methods');
    return response.data;
  },

  getPaymentStatuses: async (): Promise<PaymentStatusDto[]> => {
    const response = await api.get('/api/payment-statuses');
    return response.data;
  },

  getTableStates: async (): Promise<TableStateDto[]> => {
    const response = await api.get('/api/table-states');
    return response.data;
  },
};
