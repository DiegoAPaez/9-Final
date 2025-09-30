import React, { useState } from 'react';
import MenuItemFormBase from './MenuItemFormBase';
import { validateMenuItem, type CategoryEnum } from '../../utils/menuValidation';
import type { CreateMenuItemRequest } from '../../services/api/menu';
import { useAllergens } from '../../hooks/useAllergens';
import type { MenuFormData } from './MenuFormFields';

interface CreateMenuItemFormProps {
  onSubmit: (data: CreateMenuItemRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const CreateMenuItemForm: React.FC<CreateMenuItemFormProps> = ({
  onSubmit,
  isLoading,
  error
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { allergens, loading: loadingAllergens, error: allergenError } = useAllergens();

  const initialValues: MenuFormData = {
    name: '',
    description: '',
    price: 0,
    category: '' as CategoryEnum,
    allergens: []
  };

  const handleFormSubmit = async (data: MenuFormData) => {
    setSubmitError(null);
    const validation = validateMenuItem(data.name, data.description, data.price, data.category);
    if (!validation.isValid) {
      setSubmitError(validation.error!);
      return;
    }
    const createRequest: CreateMenuItemRequest = {
      name: data.name.trim(),
      description: data.description.trim(),
      price: data.price,
      category: data.category,
      allergens: data.allergens
    };
    await onSubmit(createRequest);
  };

  return (
    <MenuItemFormBase
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      isLoading={isLoading}
      error={submitError || error}
      allergens={allergens}
      loadingAllergens={loadingAllergens}
      allergenError={allergenError}
      isCreate={true}
    />
  );
};

export default CreateMenuItemForm;
