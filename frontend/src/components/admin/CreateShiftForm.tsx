import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import {Alert} from '../ui/Alert';
import { LoadingSpinner } from '../ui/Loading';
import ShiftFormFields, {type ShiftFormData } from './ShiftFormFields';
import { validateShiftDates } from '../../utils/shiftValidation';
import type { CreateShiftRequest, UserInfo } from '../../services/api';

interface CreateShiftFormProps {
  onSubmit: (data: CreateShiftRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  users: UserInfo[];
}

const CreateShiftForm: React.FC<CreateShiftFormProps> = ({
  onSubmit,
  isLoading,
  error,
  users = []
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<ShiftFormData>({
    defaultValues: {
      startDate: '',
      endDate: '',
      userId: 0
    }
  });

  const onFormSubmit = async (data: ShiftFormData) => {
    try {
      setSubmitError(null);

      // Use shared validation
      const validation = validateShiftDates(data.startDate, data.endDate);
      if (!validation.isValid) {
        setSubmitError(validation.error!);
        return;
      }

      // Convert to CreateShiftRequest format
      const createRequest: CreateShiftRequest = {
        startDate: data.startDate,
        endDate: data.endDate,
        userId: data.userId
      };

      await onSubmit(createRequest);
      reset();
    } catch {
      setSubmitError('Failed to create shift. Please try again.');
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

      <ShiftFormFields
        register={register}
        errors={errors}
        watch={watch}
        users={users}
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
            'Create Shift'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateShiftForm;
