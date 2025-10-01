import React from 'react';
import { useForm } from 'react-hook-form';
import MenuFormFields, {type MenuFormData } from './MenuFormFields';
import Button from '../ui/Button';
import { Alert } from '../ui/Alert';
import { LoadingSpinner } from '../ui/Loading';
import type { AllergenOption } from '../../hooks/useAllergens';

interface MenuItemFormBaseProps {
  initialValues: MenuFormData;
  onSubmit: (data: MenuFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading: boolean;
  error: string | null;
  allergens: AllergenOption[];
  loadingAllergens: boolean;
  allergenError: string | null;
  isCreate?: boolean;
  menuItemId?: number;
}

const MenuItemFormBase: React.FC<MenuItemFormBaseProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
  error,
  allergens,
  loadingAllergens,
  allergenError,
  isCreate = false,
  menuItemId
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<MenuFormData>({
    defaultValues: initialValues
  });

  const displayError = error || allergenError;

  if (loadingAllergens) {
    return (
      <div className="flex justify-center items-center h-32">
        <LoadingSpinner size="md" />
        <span className="ml-2">Loading item details</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {displayError && (
        <Alert variant="error">
          {displayError}
        </Alert>
      )}

      <MenuFormFields
        register={register}
        errors={errors}
        watch={watch}
        isCreate={isCreate}
        menuItemId={menuItemId}
        allergens={allergens}
      />

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </Button>
        )}
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
          className="min-w-[140px]"
        >
          {(isLoading || isSubmitting) ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>{isCreate ? 'Creating...' : 'Updating...'}</span>
            </div>
          ) : (
            isCreate ? 'Create Menu Item' : 'Update Menu Item'
          )}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemFormBase;

