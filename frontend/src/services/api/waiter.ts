import api from './base';


// Order related types
export interface OrderDto {
  id: number;
  tableId: number;
  userId: number;
  orderState: OrderStateEnum;
  customerCount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  tableId: number;
  userId: number;
  orderState: OrderStateEnum;
  customerCount: number;
}

export interface UpdateOrderRequest {
  tableId?: number;
  userId?: number;
  orderState?: OrderStateEnum;
  customerCount?: number;
}

// Order Item related types
export interface OrderItemDto {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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

// Order state enum
export const ORDER_STATE_ENUM = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'SERVED',
  'COMPLETED',
  'CANCELLED'
] as const;

export type OrderStateEnum = typeof ORDER_STATE_ENUM[number];

// Waiter-specific APIs
export const waiterAPI = {
  // Table operations
  getTables: async () => {
    const response = await api.get('/api/tables');
    return response.data;
  },

  getTableById: async (id: number) => {
    const response = await api.get(`/api/tables/${id}`);
    return response.data;
  },

  // Order operations
  getOrders: async (): Promise<OrderDto[]> => {
    const response = await api.get('/api/orders');
    return response.data;
  },

  getOrderById: async (id: number): Promise<OrderDto> => {
    const response = await api.get(`/api/orders/${id}`);
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

  updateOrderState: async (id: number, state: OrderStateEnum): Promise<OrderDto> => {
    const response = await api.patch(`/api/orders/${id}/state?state=${state}`);
    return response.data;
  },

  calculateOrderTotal: async (id: number): Promise<OrderDto> => {
    const response = await api.patch(`/api/orders/${id}/calculate-total`);
    return response.data;
  },

  deleteOrder: async (id: number): Promise<void> => {
    await api.delete(`/api/orders/${id}`);
  },

  // Order Item operations
  getOrderItems: async (): Promise<OrderItemDto[]> => {
    const response = await api.get('/api/order-items');
    return response.data;
  },

  getOrderItemsByOrder: async (orderId: number): Promise<OrderItemDto[]> => {
    const response = await api.get(`/api/order-items/order/${orderId}`);
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
};
