import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import {Alert} from '../ui/Alert';
import { LoadingSpinner } from '../ui/Loading';
import ShiftFormFields, { type  ShiftFormData } from './ShiftFormFields';
import { validateShiftDates, formatDateForInput } from '../../utils/shiftValidation';
import type { UpdateShiftRequest, UserInfo, ShiftDto } from '../../services/api';

interface EditShiftFormProps {
  shift: ShiftDto;
  onSubmit: (data: UpdateShiftRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
  users: UserInfo[];
}

const EditShiftForm: React.FC<EditShiftFormProps> = ({
  shift,
  onSubmit,
  onCancel,
  isLoading,
  error,
  users = []
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<ShiftFormData>({
    defaultValues: {
      startDate: formatDateForInput(shift.startDate),
      endDate: formatDateForInput(shift.endDate),
      userId: shift.userId
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

      // Convert to UpdateShiftRequest format
      const updateRequest: UpdateShiftRequest = {
        startDate: data.startDate,
        endDate: data.endDate,
        userId: data.userId
      };

      await onSubmit(updateRequest);
    } catch {
      setSubmitError('Failed to update shift. Please try again.');
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
        isCreate={false}
        shiftId={shift.id}
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
            'Update Shift'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EditShiftForm;
