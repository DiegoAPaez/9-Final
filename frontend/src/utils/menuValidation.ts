// Shared validation logic for menu forms
export interface MenuValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateMenuItem = (name: string, description: string, price: number, category: string): MenuValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Menu item name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Menu item name must be at least 2 characters long' };
  }

  if (!description.trim()) {
    return { isValid: false, error: 'Description is required' };
  }

  if (description.trim().length < 10) {
    return { isValid: false, error: 'Description must be at least 10 characters long' };
  }

  if (price <= 0) {
    return { isValid: false, error: 'Price must be greater than 0' };
  }

  if (price > 999.99) {
    return { isValid: false, error: 'Price cannot exceed €999.99' };
  }

  if (!category.trim()) {
    return { isValid: false, error: 'Category is required' };
  }

  return { isValid: true };
};

export const formatPrice = (price: number): string => {
  return `€${price.toFixed(2)}`;
};

export const parsePrice = (priceString: string): number => {
  const parsed = parseFloat(priceString);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
};


export const ALLERGEN_ENUM = [
  'GLUTEN',
  'DAIRY',
  'EGGS',
  'FISH',
  'SHELLFISH',
  'TREE_NUTS',
  'PEANUTS',
  'SOY',
  'SESAME',
  'SULFITES',
  'MUSTARD',
  'CELERY',
  'LUPIN',
  'MOLLUSKS'
] as const;

export const CATEGORY_ENUM = [
  'STARTER',
  'MAIN',
  'DESSERT',
  'BEVERAGE',
  'ADDITIONAL'
] as const;

export type AllergenEnum = typeof ALLERGEN_ENUM[number];
export type CategoryEnum = typeof CATEGORY_ENUM[number];

// Helper functions to format enum values for display
export const formatAllergenName = (allergen: AllergenEnum): string => {
  return allergen.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export const formatCategoryName = (category: CategoryEnum): string => {
  return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};
