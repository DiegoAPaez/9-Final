// Shared validation logic for shift forms
export interface ShiftValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateShiftDates = (startDate: string, endDate: string): ShiftValidationResult => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    return { isValid: false, error: 'End date must be after start date' };
  }

  const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  if (diffHours < 1) {
    return { isValid: false, error: 'Shift must be at least 1 hour long' };
  }

  if (diffHours > 24) {
    return { isValid: false, error: 'Shift cannot be longer than 24 hours' };
  }

  return { isValid: true };
};

export const calculateShiftDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return `${diffHours.toFixed(1)} hours`;
};

export const formatDateForInput = (dateString: string): string => {
  // Format ISO string for datetime-local input (remove seconds and timezone)
  return dateString.slice(0, 16);
};
