import api from './base';

export interface OrderDto {
  id: number;
  tableId: number;
  userId: number;
  orderState: string;
  customerCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  tableId: number;
  userId: number;
  orderState: string;
  customerCount: number;
}

export interface UpdateOrderRequest {
  tableId?: number;
  userId?: number;
  orderState?: string;
  customerCount?: number;
}

export const ordersAPI = {
  getOrders: async (): Promise<OrderDto[]> => {
    const response = await api.get('/api/orders');
    return response.data;
  },

  getOrderById: async (id: number): Promise<OrderDto> => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  getOrdersByDateRange: async (startDate: string, endDate: string): Promise<OrderDto[]> => {
    const response = await api.get('/api/orders/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  getOrdersByTable: async (tableId: number): Promise<OrderDto[]> => {
    const response = await api.get(`/api/orders/table/${tableId}`);
    return response.data;
  },

  getOrdersByUser: async (userId: number): Promise<OrderDto[]> => {
    const response = await api.get(`/api/orders/user/${userId}`);
    return response.data;
  },

  createOrder: async (orderData: CreateOrderRequest): Promise<OrderDto> => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  updateOrder: async (id: number, orderData: UpdateOrderRequest): Promise<OrderDto> => {
    const response = await api.put(`/api/orders/${id}`, orderData);
    return response.data;
  },

  updateOrderState: async (id: number, state: string): Promise<void> => {
    await api.patch(`/api/orders/${id}/state`, null, {
      params: { state }
    });
  },

  deleteOrder: async (id: number): Promise<void> => {
    await api.delete(`/api/orders/${id}`);
  },

  calculateOrderTotal: async (id: number): Promise<void> => {
    await api.patch(`/api/orders/${id}/calculate-total`);
  },
};
