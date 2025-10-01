import React from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface CreateUserFormData {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface CreateUserFormProps {
  createForm: CreateUserFormData;
  setCreateForm: React.Dispatch<React.SetStateAction<CreateUserFormData>>;
  onSubmit: (formData: CreateUserFormData) => void;
  onCancel: () => void;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  availableRoles: string[];
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  createForm,
  setCreateForm,
  onSubmit,
  onCancel,
  loading,
  showPassword,
  setShowPassword,
  availableRoles
}) => {
  return (
    <Card className="border-2 border-primary-300 bg-white dark:bg-primary-800">
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-100">Create New User</h3>
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
              value={createForm.username}
              onChange={(e) => setCreateForm(prev => ({ ...prev, username: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="user@example.com"
              value={createForm.email}
              onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-primary-100 mb-1">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border border-primary-200 dark:border-primary-600 rounded-md bg-white dark:bg-primary-700 text-primary-700 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={createForm.role}
                onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value }))}
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
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={createForm.password}
              onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
              required
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-primary-500 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-100"
                >
                  {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => onSubmit(createForm)}
              loading={loading}
            >
              Create User
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateUserForm;
