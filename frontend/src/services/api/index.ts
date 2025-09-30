// Re-export all API services and types from their respective modules
export * from './auth';
export * from './users';
export * from './orders';
export * from './payments';
export * from './tables';
export * from './shifts';
export * from './menu';
export * from './orderItems';
export * from './referenceData';

// Export the base axios instance
export { default as api } from './base';

// Convenience exports for backward compatibility
export { authAPI } from './auth';
export { userAPI as userAPI } from './users';
export { ordersAPI } from './orders';
export { paymentsAPI } from './payments';
export { tablesAPI } from './tables';
export { shiftsAPI } from './shifts';
export { menuAPI } from './menu';
export { orderItemsAPI } from './orderItems';
export { referenceDataAPI } from './referenceData';
