import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import Input from '../ui/Input';
import {
  TABLE_STATE_ENUM,
  formatTableStateName,
  type TableStateEnum
} from '../../utils/tableValidation';

// Unified form data type that works for both create and edit
export interface TableFormData {
  number: number;
  tableState: TableStateEnum;
  currentOrderId?: number | null;
}

interface TableFormFieldsProps {
  register: UseFormRegister<TableFormData>;
  errors: FieldErrors<TableFormData>;
  watch: UseFormWatch<TableFormData>;
  isCreate?: boolean;
  tableId?: number;
}

const TableFormFields: React.FC<TableFormFieldsProps> = ({
  register,
  errors,
  watch,
  isCreate = false,
  tableId
}) => {
  return (
    <>
      {/* Table ID Info for Edit Mode */}
      {!isCreate && tableId && (
        <div className="p-3 bg-primary-50 dark:bg-primary-900 rounded-md">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Editing Table ID:</strong> {tableId}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Table Number */}
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
            Table Number *
          </label>
          <Input
            type="number"
            min="1"
            max="999"
            {...register('number', {
              required: 'Table number is required',
              valueAsNumber: true,
              validate: (value) => {
                if (value <= 0) return 'Table number must be greater than 0';
                if (value > 999) return 'Table number cannot exceed 999';
                return true;
              }
            })}
            placeholder="e.g., 15"
            className="w-full"
          />
          {errors.number && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.number.message}
            </p>
          )}
        </div>

        {/* Table State */}
        <div>
          <label htmlFor="tableState" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
            Table State *
          </label>
          <select
            {...register('tableState', {
              required: 'Please select a table state'
            })}
            className="w-full px-3 py-2 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm bg-white dark:bg-primary-800 text-primary-900 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select table state...</option>
            {TABLE_STATE_ENUM.map((state) => (
              <option key={state} value={state}>
                {formatTableStateName(state)}
              </option>
            ))}
          </select>
          {errors.tableState && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.tableState.message}
            </p>
          )}
        </div>
      </div>

      {/* Current Order ID (Edit mode only) */}
      {!isCreate && (
        <div>
          <label htmlFor="currentOrderId" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
            Current Order ID (Optional)
          </label>
          <Input
            type="number"
            min="0"
            {...register('currentOrderId', {
              valueAsNumber: true,
              validate: (value) => {
                if (value !== undefined && value !== null && value < 0) {
                  return 'Order ID cannot be negative';
                }
                return true;
              }
            })}
            placeholder="Leave empty if no active order"
            className="w-full"
          />
          {errors.currentOrderId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.currentOrderId.message}
            </p>
          )}
          <p className="mt-1 text-sm text-primary-500 dark:text-primary-400">
            Enter the order ID currently assigned to this table (if any)
          </p>
        </div>
      )}

      {/* Table Number Preview */}
      {watch('number') > 0 && (
        <div className="p-3 bg-primary-50 dark:bg-primary-900 rounded-md">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Table Display:</strong> Table {watch('number')}
          </p>
        </div>
      )}
    </>
  );
};

export default TableFormFields;
