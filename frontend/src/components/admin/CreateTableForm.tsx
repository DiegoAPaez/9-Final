import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { Alert } from '../ui/Alert';
import { LoadingSpinner } from '../ui/Loading';
import TableFormFields, { type TableFormData } from './TableFormFields';
import { validateTable, type TableStateEnum } from '../../utils/tableValidation';
import type { CreateRestaurantTableRequest } from '../../services/api';

interface CreateTableFormProps {
  onSubmit: (data: CreateRestaurantTableRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CreateTableForm: React.FC<CreateTableFormProps> = ({
  onSubmit,
  isLoading,
  error
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<TableFormData>({
    defaultValues: {
      number: 0,
      tableState: '' as TableStateEnum,
      currentOrderId: null
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

      // Convert to CreateRestaurantTableRequest format
      const createRequest: CreateRestaurantTableRequest = {
        number: data.number,
        tableState: data.tableState
      };

      await onSubmit(createRequest);
      reset();
    } catch {
      setSubmitError('Failed to create table. Please try again.');
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
        isCreate={true}
      />

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset()}
          disabled={isLoading || isSubmitting}
        >
          Reset
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
              <span>Creating...</span>
            </div>
          ) : (
            'Create Table'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateTableForm;
