import api from './base';

export interface OrderItemDto {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderItemRequest {
  menuItemId: number;
  quantity: number;
  unitPrice: number;
}

export interface UpdateOrderItemRequest {
  menuItemId?: number;
  quantity?: number;
  unitPrice?: number;
}

export const orderItemsAPI = {
  getAllOrderItems: async (): Promise<OrderItemDto[]> => {
    const response = await api.get('/api/order-items');
    return response.data;
  },

  getOrderItemById: async (id: number): Promise<OrderItemDto> => {
    const response = await api.get(`/api/order-items/${id}`);
    return response.data;
  },

  getOrderItemsByOrder: async (orderId: number): Promise<OrderItemDto[]> => {
    const response = await api.get(`/api/order-items/order/${orderId}`);
    return response.data;
  },

  getOrderItemsByMenuItem: async (menuItemId: number): Promise<OrderItemDto[]> => {
    const response = await api.get(`/api/order-items/menu-item/${menuItemId}`);
    return response.data;
  },

  addItemToOrder: async (orderId: number, itemData: CreateOrderItemRequest): Promise<OrderItemDto> => {
    const response = await api.post(`/api/order-items/order/${orderId}`, itemData);
    return response.data;
  },

  updateOrderItem: async (id: number, itemData: UpdateOrderItemRequest): Promise<OrderItemDto> => {
    const response = await api.put(`/api/order-items/${id}`, itemData);
    return response.data;
  },

  deleteOrderItem: async (id: number): Promise<void> => {
    await api.delete(`/api/order-items/${id}`);
  },

  deleteAllOrderItems: async (orderId: number): Promise<void> => {
    await api.delete(`/api/order-items/order/${orderId}`);
  },
};
