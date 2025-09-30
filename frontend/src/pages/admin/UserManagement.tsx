import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { type SortingState } from '@tanstack/react-table';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/Loading';
import { Alert } from '../../components/ui/Alert';
import { PlusIcon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';


import UserTable from '../../components/admin/UserTable';
import CreateUserForm from '../../components/admin/CreateUserForm';
import EditUserForm from '../../components/admin/EditUserForm';
import ChangePasswordForm from '../../components/admin/ChangePasswordForm';
import { useUserManagement } from '../../hooks/useUserManagement';

const UserManagement: React.FC = () => {
  const {
    users,
    isLoading,
    error,
    setError,
    actionLoading,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,
    createForm,
    setCreateForm,
    editForm,
    setEditForm,
    passwordForm,
    setPasswordForm,
    showPassword,
    setShowPassword,
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleChangePassword,
    handleUpdatePassword,
    handleConfirmDelete,
  } = useUserManagement();

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const availableRoles = ['ADMIN', 'CASHIER', 'WAITER'];

  const navigate = useNavigate();

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
    );
  }

  return (
      <div className="space-y-6 bg-primary-50 dark:bg-primary-900 min-h-screen p-6">
        {/* Header */}
        <div className="space-y-4">
          {/* Back to Dashboard Button */}
          <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="w-fit"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-100">User Management</h1>
              <p className="mt-1 text-primary-500 dark:text-primary-300">
                Manage staff accounts, roles, and permissions.
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
            <Alert variant="error" onDismiss={() => setError(null)}>
              {error}
            </Alert>
        )}

        {/* Create User Form - Inline */}
        {isCreateModalOpen && (
          <CreateUserForm
            createForm={createForm}
            setCreateForm={setCreateForm}
            onSubmit={(formData) => handleCreateUser(formData)}
            onCancel={() => setIsCreateModalOpen(false)}
            loading={actionLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            availableRoles={availableRoles}
          />
        )}

        {/* Edit User Form - Inline */}
        {isEditModalOpen && selectedUser && (
          <EditUserForm
            editForm={editForm}
            setEditForm={setEditForm}
            onSubmit={(formData) => handleUpdateUser(formData)}
            onCancel={() => setIsEditModalOpen(false)}
            onDelete={handleConfirmDelete}
            loading={actionLoading}
            availableRoles={availableRoles}
            selectedUserName={selectedUser.username}
            showDeleteConfirmation={isDeleteModalOpen}
            setShowDeleteConfirmation={setIsDeleteModalOpen}
          />
        )}

        {/* Change Password Form - Inline */}
        {isPasswordModalOpen && selectedUser && (
          <ChangePasswordForm
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            onSubmit={(formData) => handleUpdatePassword(formData)}
            onCancel={() => setIsPasswordModalOpen(false)}
            loading={actionLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            selectedUserName={selectedUser.username}
          />
        )}

        {/* Filters and Search */}
        <Card className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600">
          <CardContent className="pb-0">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <Input
                    placeholder="Search users..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    startIcon={<MagnifyingGlassIcon />}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-500 dark:text-primary-300">
                <span>Total: {users.length} users</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table Component */}
        <UserTable
            users={users}
            sorting={sorting}
            setSorting={setSorting}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            onEditUser={handleEditUser}
            onChangePassword={handleChangePassword}
        />
      </div>
  );
};

export default UserManagement;
