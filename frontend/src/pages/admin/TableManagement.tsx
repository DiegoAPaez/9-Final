import React from 'react';
import { useNavigate } from 'react-router';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { LoadingOverlay } from '../../components/ui/Loading';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import TableTable from '../../components/admin/TableTable';
import CreateTableForm from '../../components/admin/CreateTableForm';
import EditTableForm from '../../components/admin/EditTableForm';
import { useTableManagement } from '../../hooks/useTableManagement';
import { TABLE_STATE_ENUM, formatTableStateName } from '../../utils/tableValidation';

const TableManagement: React.FC = () => {
  const navigate = useNavigate();

  const {
    // State
    tables,
    isLoading,
    error,
    setError,
    actionLoading,

    // Search/Filter state
    searchTerm,
    setSearchTerm,
    stateFilter,
    setStateFilter,

    // Modal states
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedTable,

    // Handlers
    handleCreateTable,
    handleEditTable,
    handleUpdateTable,
    handleUpdateTableState,
    handleDeleteTable,
    handleConfirmDelete,
  } = useTableManagement();

  const clearFilters = () => {
    setSearchTerm('');
    setStateFilter('');
  };

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950 p-6">
      <LoadingOverlay
        isVisible={actionLoading}
        text="Processing table operation..."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100">
              Table Management
            </h1>
            <p className="text-primary-600 dark:text-primary-300 mt-1">
              Manage restaurant tables and seating arrangements
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
              + Add New Table
            </Button>
          </div>
        </div>

        {/* Global Error Display */}
        {error && (
          <Alert
            variant="error"
            onDismiss={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Search and Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary-800 dark:text-primary-100">
              Search & Filter Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search by Table Number */}
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Search by Table Number
                </label>
                <Input
                  type="text"
                  placeholder="Enter table number..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                  Table State
                </label>
                <select
                  value={stateFilter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-primary-300 dark:border-primary-600 rounded-md shadow-sm bg-white dark:bg-primary-800 text-primary-900 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All States</option>
                  {TABLE_STATE_ENUM.map((state) => (
                    <option key={state} value={state}>
                      {formatTableStateName(state)}
                    </option>
                  ))}
                </select>
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
                Showing {tables.length} table{tables.length !== 1 ? 's' : ''}
                {(searchTerm || stateFilter) && (
                  <span className="ml-1 text-primary-500 dark:text-primary-300">
                    (filtered results)
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tables Table */}
        <TableTable
          tables={tables}
          isLoading={isLoading}
          onEditTable={handleEditTable}
          onDeleteTable={handleDeleteTable}
          onUpdateTableState={handleUpdateTableState}
        />

        {/* Create Table Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-primary-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
                    Create New Table
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

                <CreateTableForm
                  onSubmit={handleCreateTable}
                  isLoading={actionLoading}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Table Modal */}
        {isEditModalOpen && selectedTable && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-primary-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
                    Edit Table
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

                <EditTableForm
                  table={selectedTable}
                  onSubmit={handleUpdateTable}
                  onCancel={() => setIsEditModalOpen(false)}
                  isLoading={actionLoading}
                  error={error}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedTable && (
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
                    Delete Table
                  </h3>
                  <p className="text-sm text-primary-600 dark:text-primary-400 mb-6">
                    Are you sure you want to delete this table? This action cannot be undone.
                  </p>

                  <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-md mb-6 text-left">
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      <strong>Table:</strong> Table {selectedTable.number}<br />
                      <strong>Current State:</strong> {formatTableStateName(selectedTable.tableState)}<br />
                      {selectedTable.currentOrderId && (
                        <><strong>Active Order:</strong> #{selectedTable.currentOrderId}<br /></>
                      )}
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
                      {actionLoading ? 'Deleting...' : 'Delete Table'}
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

export default TableManagement;
