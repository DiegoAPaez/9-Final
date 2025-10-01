// Restaurant Table Types
export interface RestaurantTable {
  id: number;
  number: number;
  currentOrderId: number | null;
  tableState: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'OUT_OF_SERVICE';
}

export interface CreateRestaurantTableRequest {
  number: number;
  tableState: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'OUT_OF_SERVICE';
}

export interface UpdateRestaurantTableRequest {
  number?: number;
  currentOrderId?: number | null;
  tableState?: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'OUT_OF_SERVICE';
}

// Order Types
export interface Order {
  id: number;
  tableId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  totalAmount: number;
  orderState: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'PAID' | 'CANCELLED';
  customerCount: number;
}

export interface CreateOrderRequest {
  tableId: number;
  userId: number;
  orderState: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'PAID' | 'CANCELLED';
  customerCount: number;
}

export interface UpdateOrderRequest {
  tableId?: number;
  userId?: number;
  orderState?: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'PAID' | 'CANCELLED';
  customerCount?: number;
}

// Order Item Types
export interface OrderItem {
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

// Menu Item Types
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  allergens: string[];
}

// User Types
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'WAITER' | 'CASHIER';
}

// API Response Types
export type TableState = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'OUT_OF_SERVICE';
export type OrderState = 'PENDING' | 'PREPARING' | 'READY' | 'SERVED' | 'PAID' | 'CANCELLED';
