import React from 'react';
import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import Input from '../ui/Input';
import {
  CATEGORY_ENUM,
  formatCategoryName,
  type CategoryEnum
} from '../../utils/menuValidation';

// Unified form data type that works for both create and edit
export interface MenuFormData {
  name: string;
  description: string;
  price: number;
  category: CategoryEnum;
  allergens: number[]; // now array of allergen IDs
}

interface AllergenOption {
  id: number;
  name: string;
}

interface MenuFormFieldsProps {
  register: UseFormRegister<MenuFormData>;
  errors: FieldErrors<MenuFormData>;
  watch: UseFormWatch<MenuFormData>;
  isCreate?: boolean;
  menuItemId?: number;
  allergens: AllergenOption[];
}

const MenuFormFields: React.FC<MenuFormFieldsProps> = ({
  register,
  errors,
  watch,
  isCreate = false,
  menuItemId,
  allergens
}) => {
  return (
    <>
      {/* Menu Item ID Info for Edit Mode */}
      {!isCreate && menuItemId && (
        <div className="p-3 bg-primary-50 dark:bg-primary-900 rounded-md">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Editing Menu Item ID:</strong> {menuItemId}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
            Item Name *
          </label>
          <Input
            type="text"
            {...register('name', {
              required: 'Item name is required',
              minLength: {
                value: 2,
                message: 'Item name must be at least 2 characters long'
              },
              maxLength: {
                value: 100,
                message: 'Item name cannot exceed 100 characters'
              }
            })}
            placeholder="e.g., Margherita Pizza"
            className="w-full"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
            Price (€) *
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="999.99"
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
              validate: (value) => {
                if (value <= 0) return 'Price must be greater than 0';
                if (value > 999.99) return 'Price cannot exceed €999.99';
                return true;
              }
            })}
            placeholder="12.50"
            className="w-full"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.price.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
          Description *
        </label>
        <textarea
          {...register('description', {
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters long'
            },
            maxLength: {
              value: 500,
              message: 'Description cannot exceed 500 characters'
            }
          })}
          rows={3}
          placeholder="Describe the menu item, ingredients, preparation method..."
          className="w-full px-3 py-2 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm bg-white dark:bg-primary-800 text-primary-900 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
        <p className="mt-1 text-sm text-primary-500 dark:text-primary-400">
          {watch('description')?.length || 0}/500 characters
        </p>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
          Category *
        </label>
        <select
          {...register('category', {
            required: 'Please select a category'
          })}
          className="w-full px-3 py-2 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm bg-white dark:bg-primary-800 text-primary-900 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select a category...</option>
          {Object.values(CATEGORY_ENUM).map((category) => (
            <option key={category} value={category}>
              {formatCategoryName(category)}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Allergens */}
      <div>
        <label htmlFor="allergens" className="block text-sm font-medium mb-1">
          Allergens
        </label>
        <div className="flex flex-wrap gap-2">
          {allergens.map((allergen) => {
            const checked = watch('allergens')?.includes(allergen.id) || false;
            return (
              <label key={allergen.id} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  value={allergen.id}
                  checked={checked}
                  onChange={e => {
                    const current = watch('allergens') || [];
                    const value = Number(e.target.value);
                    let updated: number[];
                    if (e.target.checked) {
                      updated = [...current, value];
                    } else {
                      updated = current.filter((id: number) => id !== value);
                    }
                    register('allergens').onChange({
                      target: { value: updated, name: 'allergens' }
                    });
                  }}
                />
                <span>{allergen.name}</span>
              </label>
            );
          })}
        </div>
        {errors.allergens && (
          <span className="text-xs text-red-500">{errors.allergens.message as string}</span>
        )}
      </div>

      {/* Price Preview */}
      {watch('price') > 0 && (
        <div className="p-3 bg-primary-50 dark:bg-primary-900 rounded-md">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Price Preview:</strong> €{watch('price')?.toFixed(2)}
          </p>
        </div>
      )}
    </>
  );
};

export default MenuFormFields;
