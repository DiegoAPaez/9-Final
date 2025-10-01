import api from './base';

export interface PaymentDto {
  id: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderId: number;
  createdAt: string;
}

export interface CreatePaymentRequest {
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderId: number;
}

export interface UpdatePaymentRequest {
  amount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  orderId?: number;
}

export const paymentsAPI = {
  // Admin Payment Management
  getAllPayments: async (): Promise<PaymentDto[]> => {
    const response = await api.get('/api/admin/payments');
    return response.data;
  },

  getPaymentById: async (id: number): Promise<PaymentDto> => {
    const response = await api.get(`/api/admin/payments/${id}`);
    return response.data;
  },

  getPaymentsByOrderId: async (orderId: number): Promise<PaymentDto[]> => {
    const response = await api.get(`/api/admin/payments/order/${orderId}`);
    return response.data;
  },

  getPaymentsByStatus: async (status: string): Promise<PaymentDto[]> => {
    const response = await api.get(`/api/admin/payments/status/${status}`);
    return response.data;
  },

  getPaymentsByDateRange: async (startDate: string, endDate: string): Promise<PaymentDto[]> => {
    const response = await api.get('/api/admin/payments/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  deletePayment: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/payments/${id}`);
  },

  // Cashier Payment Management
  createPayment: async (paymentData: CreatePaymentRequest): Promise<PaymentDto> => {
    const response = await api.post('/api/cashier/payments', paymentData);
    return response.data;
  },

  updatePayment: async (id: number, paymentData: UpdatePaymentRequest): Promise<PaymentDto> => {
    const response = await api.put(`/api/cashier/payments/${id}`, paymentData);
    return response.data;
  },

  updatePaymentStatus: async (id: number, status: string): Promise<void> => {
    await api.patch(`/api/cashier/payments/${id}/status`, null, {
      params: { status }
    });
  },

  // Cashier specific endpoints
  getCashierPaymentById: async (id: number): Promise<PaymentDto> => {
    const response = await api.get(`/api/cashier/payments/${id}`);
    return response.data;
  },

  getCashierPaymentsByStatus: async (status: string): Promise<PaymentDto[]> => {
    const response = await api.get(`/api/cashier/payments/status/${status}`);
    return response.data;
  },
};
