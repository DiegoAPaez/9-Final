import React from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatPrice, formatCategoryName } from '../../utils/menuValidation';
import type { MenuItemDto } from '../../services/api';

interface MenuTableProps {
  menuItems: MenuItemDto[];
  isLoading: boolean;
  onEditMenuItem: (menuItem: MenuItemDto) => void;
  onDeleteMenuItem: (menuItem: MenuItemDto) => void;
}

const MenuTable: React.FC<MenuTableProps> = ({
  menuItems,
  isLoading,
  onEditMenuItem,
  onDeleteMenuItem
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      STARTER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      MAIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      DESSERT: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      BEVERAGE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ADDITIONAL: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-primary-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-600">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-primary-200 dark:bg-primary-700 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-primary-100 dark:bg-primary-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="bg-white dark:bg-primary-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-600">
        <div className="p-8 text-center">
          <div className="text-primary-400 dark:text-primary-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-primary-700 dark:text-primary-200 mb-2">
            No menu items found
          </h3>
          <p className="text-primary-500 dark:text-primary-400">
            No menu items match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-primary-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-600 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-primary-200 dark:divide-primary-600">
          <thead className="bg-primary-50 dark:bg-primary-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Allergens
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-primary-800 divide-y divide-primary-200 dark:divide-primary-600">
            {menuItems.map((item) => (
              <tr key={item.id} className="hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors">
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-primary-900 dark:text-primary-100">
                      {item.name}
                    </div>
                    <div className="text-sm text-primary-500 dark:text-primary-400 mt-1 truncate">
                      {item.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getCategoryColor(item.category)}>
                    {formatCategoryName(item.category)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-primary-900 dark:text-primary-100">
                    {formatPrice(item.price)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {item.allergens.length > 0 ? (
                      item.allergens.map((allergen, index) => (
                        <Badge
                          key={index}
                          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs"
                        >
                          {allergen}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-primary-400 dark:text-primary-500">
                        None
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEditMenuItem(item)}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteMenuItem(item)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTable;
