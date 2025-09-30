import React, { useState } from 'react';
import MenuItemFormBase from './MenuItemFormBase';
import { validateMenuItem, type CategoryEnum } from '../../utils/menuValidation';
import type { UpdateMenuItemRequest, MenuItemDto } from '../../services/api';
import { useAllergens } from '../../hooks/useAllergens';
import type { MenuFormData } from './MenuFormFields';

interface EditMenuItemFormProps {
  menuItem: MenuItemDto;
  onSubmit: (data: UpdateMenuItemRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error: string | null;
}

const EditMenuItemForm: React.FC<EditMenuItemFormProps> = ({
  menuItem,
  onSubmit,
  onCancel,
  isLoading,
  error
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { allergens, loading: loadingAllergens, error: allergenError } = useAllergens();

  const initialValues: MenuFormData = {
    name: menuItem.name,
    description: menuItem.description,
    price: menuItem.price,
    category: menuItem.category as CategoryEnum,
    allergens: menuItem.allergens
  };

  const handleFormSubmit = async (data: MenuFormData) => {
    setSubmitError(null);
    const validation = validateMenuItem(data.name, data.description, data.price, data.category);
    if (!validation.isValid) {
      setSubmitError(validation.error!);
      return;
    }
    const updateRequest: UpdateMenuItemRequest = {
      name: data.name.trim(),
      description: data.description.trim(),
      price: data.price,
      category: data.category,
      allergens: data.allergens
    };
    await onSubmit(updateRequest);
  };

  return (
    <MenuItemFormBase
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
      error={submitError || error}
      allergens={allergens}
      loadingAllergens={loadingAllergens}
      allergenError={allergenError}
      isCreate={false}
      menuItemId={menuItem.id}
    />
  );
};

export default EditMenuItemForm;
