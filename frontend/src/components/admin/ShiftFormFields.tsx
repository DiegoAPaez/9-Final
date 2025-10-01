import React, { useEffect } from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { format } from 'date-fns';
import Input from '../ui/Input';
import { calculateShiftDuration } from '../../utils/shiftValidation';
import type { UserInfo } from '../../services/api';

// Unified form data type that works for both create and edit
export interface ShiftFormData {
  startDate: string;
  endDate: string;
  userId: number;
}

interface ShiftFormFieldsProps {
  register: UseFormRegister<ShiftFormData>;
  errors: FieldErrors<ShiftFormData>;
  watch: UseFormWatch<ShiftFormData>;
  users: UserInfo[];
  isCreate?: boolean;
  shiftId?: number;
}

const ShiftFormFields: React.FC<ShiftFormFieldsProps> = ({
  register,
  errors,
  watch,
  users,
  isCreate = false,
  shiftId
}) => {
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Auto-set minimum end date when start date changes
  useEffect(() => {
    if (startDate) {
      const endDateInput = document.querySelector('input[name="endDate"]') as HTMLInputElement;
      if (endDateInput) {
        endDateInput.min = startDate;
      }
    }
  }, [startDate]);

  return (
    <>
      {/* Shift ID Info for Edit Mode */}
      {!isCreate && shiftId && (
        <div className="p-3 bg-primary-50 dark:bg-primary-900 rounded-md">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Editing Shift ID:</strong> {shiftId}
          </p>
        </div>
      )}

      {/* User Selection */}
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
          Assign to User *
        </label>
        <select
          {...register('userId', {
            required: 'Please select a user',
            validate: (value) => value! > 0 || 'Please select a valid user'
          })}
          className="w-full px-3 py-2 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm bg-white dark:bg-primary-800 text-primary-900 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value={0}>Select a user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
        {errors.userId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.userId.message}
          </p>
        )}
      </div>

      {/* Start Date & Time */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
          Start Date & Time *
        </label>
        <Input
          type="datetime-local"
          {...register('startDate', {
            required: 'Start date and time is required',
            validate: isCreate ? (value) => {
              const date = new Date(value!);
              const now = new Date();
              if (date < now) {
                return 'Start date cannot be in the past';
              }
              return true;
            } : undefined
          })}
          min={isCreate ? format(new Date(), "yyyy-MM-dd'T'HH:mm") : undefined}
          className="w-full"
        />
        {errors.startDate && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.startDate.message}
          </p>
        )}
      </div>

      {/* End Date & Time */}
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
          End Date & Time *
        </label>
        <Input
          type="datetime-local"
          {...register('endDate', {
            required: 'End date and time is required'
          })}
          min={startDate || (isCreate ? format(new Date(), "yyyy-MM-dd'T'HH:mm") : undefined)}
          className="w-full"
        />
        {errors.endDate && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.endDate.message}
          </p>
        )}
      </div>

      {/* Duration Preview */}
      {startDate && endDate && (
        <div className="p-3 bg-primary-50 dark:bg-primary-900 rounded-md">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Shift Duration:</strong> {calculateShiftDuration(startDate, endDate)}
          </p>
        </div>
      )}
    </>
  );
};

export default ShiftFormFields;
