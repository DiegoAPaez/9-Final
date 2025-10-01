// Shared validation logic for table forms
export interface TableValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateTable = (number: number, tableState: string): TableValidationResult => {
  if (!number || number <= 0) {
    return { isValid: false, error: 'Table number is required and must be greater than 0' };
  }

  if (number > 999) {
    return { isValid: false, error: 'Table number cannot exceed 999' };
  }

  if (!tableState.trim()) {
    return { isValid: false, error: 'Table state is required' };
  }

  return { isValid: true };
};

// Backend enum matching the Java TableStateEnum
export const TABLE_STATE_ENUM = [
  'AVAILABLE',
  'OCCUPIED',
  'RESERVED',
  'OUT_OF_SERVICE'
] as const;

export type TableStateEnum = typeof TABLE_STATE_ENUM[number];

// Helper function to format enum values for display
export const formatTableStateName = (state: TableStateEnum): string => {
  return state.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

// Helper function to get state color for display
export const getTableStateColor = (state: TableStateEnum) => {
  const colors = {
    AVAILABLE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    OCCUPIED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    RESERVED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    OUT_OF_SERVICE: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  };
  return colors[state] || colors.OUT_OF_SERVICE;
};
