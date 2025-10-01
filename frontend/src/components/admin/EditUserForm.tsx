import React from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EditUserFormData {
  username: string;
  email: string;
  role: string;
}

interface EditUserFormProps {
  editForm: EditUserFormData;
  setEditForm: React.Dispatch<React.SetStateAction<EditUserFormData>>;
  onSubmit: (formData: EditUserFormData) => void;
  onCancel: () => void;
  onDelete: () => void;
  loading: boolean;
  availableRoles: string[];
  selectedUserName?: string;
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: (show: boolean) => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  editForm,
  setEditForm,
  onSubmit,
  onCancel,
  onDelete,
  loading,
  availableRoles,
  selectedUserName,
  showDeleteConfirmation,
  setShowDeleteConfirmation
}) => {
  return (
    <Card className="border-2 border-warning-300 bg-white dark:bg-primary-800">
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-100">Edit User</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Username"
              placeholder="Enter username"
              value={editForm.username}
              onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="user@example.com"
              value={editForm.email}
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 dark:text-primary-100 mb-1">
              Role
            </label>
            <select
              className="w-full px-3 py-2 border border-primary-200 dark:border-primary-600 rounded-md bg-white dark:bg-primary-700 text-primary-700 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={editForm.role}
              onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
              required
            >
              <option value="">Select role</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              {!showDeleteConfirmation ? (
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteConfirmation(true)}
                  disabled={loading}
                >
                  Delete User
                </Button>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-error-50 dark:bg-error-900 border border-error-200 dark:border-error-700 rounded-md">
                  <span className="text-sm text-error-700 dark:text-error-300">
                    Delete "{selectedUserName}"?
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={onDelete}
                    loading={loading}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => onSubmit(editForm)}
                loading={loading}
              >
                Update User
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditUserForm;
