import React from 'react';
import { useNavigate } from 'react-router';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { LoadingOverlay } from '../../components/ui/Loading';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import MenuTable from '../../components/admin/MenuTable';
import CreateMenuItemForm from '../../components/admin/CreateMenuItemForm';
import EditMenuItemForm from '../../components/admin/EditMenuItemForm';
import { useMenuManagement } from '../../hooks/useMenuManagement';
import { CATEGORY_ENUM, formatCategoryName } from '../../utils/menuValidation';

const MenuManagement: React.FC = () => {
  const navigate = useNavigate();

  const {
    // State
    menuItems,
    isLoading,
    error,
    actionLoading,

    // Search/Filter state
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,

    // Modal states
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedMenuItem,

    // Handlers
    handleCreateMenuItem,
    handleEditMenuItem,
    handleUpdateMenuItem,
    handleDeleteMenuItem,
    handleConfirmDelete,
  } = useMenuManagement();

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950 p-6">
      <LoadingOverlay
        isVisible={actionLoading}
        text="Processing menu operation..."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100">
              Menu Management
            </h1>
            <p className="text-primary-600 dark:text-primary-300 mt-1">
              Manage restaurant menu items and pricing
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/dashboard')}
              className="w-full sm:w-auto"
            >
              ← Back to Dashboard
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto"
            >
              + Add New Item
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary-800 dark:text-primary-100">
              Search & Filter Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search by Name/Description */}
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Search Items
                </label>
                <Input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm bg-white dark:bg-primary-800 text-primary-900 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORY_ENUM.map((category) => (
                    <option key={category} value={category}>
                      {formatCategoryName(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Min Price (€)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={minPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPrice(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Max Price Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Max Price (€)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="999.99"
                  value={maxPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Actions */}
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-600">
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Showing {menuItems.length} menu item{menuItems.length !== 1 ? 's' : ''}
                {(searchTerm || categoryFilter || minPrice || maxPrice) && (
                  <span className="ml-1 text-primary-500 dark:text-primary-300">
                    (filtered results)
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items Table */}
        <MenuTable
          menuItems={menuItems}
          isLoading={isLoading}
          onEditMenuItem={handleEditMenuItem}
          onDeleteMenuItem={handleDeleteMenuItem}
        />

        {/* Create Menu Item Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-primary-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
                    Create New Menu Item
                  </h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200"
                  >
                    ✕
                  </Button>
                </div>

                <CreateMenuItemForm
                  onSubmit={handleCreateMenuItem}
                  isLoading={actionLoading}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Menu Item Modal */}
        {isEditModalOpen && selectedMenuItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-primary-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
                    Edit Menu Item
                  </h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200"
                  >
                    ✕
                  </Button>
                </div>

                <EditMenuItemForm
                  menuItem={selectedMenuItem}
                  onSubmit={handleUpdateMenuItem}
                  onCancel={() => setIsEditModalOpen(false)}
                  isLoading={actionLoading}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedMenuItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-primary-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium text-primary-900 dark:text-primary-100 mb-2">
                    Delete Menu Item
                  </h3>
                  <p className="text-sm text-primary-600 dark:text-primary-400 mb-6">
                    Are you sure you want to delete this menu item? This action cannot be undone.
                  </p>

                  <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-md mb-6 text-left">
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      <strong>Item:</strong> {selectedMenuItem.name}<br />
                      <strong>Category:</strong> {formatCategoryName(selectedMenuItem.category)}<br />
                      <strong>Price:</strong> €{selectedMenuItem.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleConfirmDelete}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
                    >
                      {actionLoading ? 'Deleting...' : 'Delete Item'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
