import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { Alert } from '../ui/Alert';
import { LoadingSpinner } from '../ui/Loading';
import TableFormFields, { type TableFormData } from './TableFormFields';
import { validateTable } from '../../utils/tableValidation';
import type { UpdateRestaurantTableRequest, RestaurantTableDto } from '../../services/api';

interface EditTableFormProps {
  table: RestaurantTableDto;
  onSubmit: (data: UpdateRestaurantTableRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

const EditTableForm: React.FC<EditTableFormProps> = ({
  table,
  onSubmit,
  onCancel,
  isLoading,
  error
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<TableFormData>({
    defaultValues: {
      number: table.number,
      tableState: table.tableState,
      currentOrderId: table.currentOrderId
    }
  });

  const onFormSubmit = async (data: TableFormData) => {
    try {
      setSubmitError(null);

      // Use shared validation
      const validation = validateTable(data.number, data.tableState);
      if (!validation.isValid) {
        setSubmitError(validation.error!);
        return;
      }

      // Convert to UpdateRestaurantTableRequest format
      const updateRequest: UpdateRestaurantTableRequest = {
        number: data.number,
        tableState: data.tableState,
        currentOrderId: data.currentOrderId
      };

      await onSubmit(updateRequest);
    } catch {
      setSubmitError('Failed to update table. Please try again.');
    }
  };

  const displayError = submitError || error;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {displayError && (
        <Alert variant="error">
          {displayError}
        </Alert>
      )}

      <TableFormFields
        register={register}
        errors={errors}
        watch={watch}
        isCreate={false}
        tableId={table.id}
      />

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading || isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || isSubmitting}
          className="min-w-[120px]"
        >
          {(isLoading || isSubmitting) ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Updating...</span>
            </div>
          ) : (
            'Update Table'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditTableForm;
