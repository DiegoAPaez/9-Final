import React from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface ChangePasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordFormProps {
  passwordForm: ChangePasswordFormData;
  setPasswordForm: React.Dispatch<React.SetStateAction<ChangePasswordFormData>>;
  onSubmit: (formData: { newPassword: string; confirmPassword: string }) => void;
  onCancel: () => void;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  selectedUserName?: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  passwordForm,
  setPasswordForm,
  onSubmit,
  onCancel,
  loading,
  showPassword,
  setShowPassword,
  selectedUserName
}) => {
  return (
    <Card className="border-2 border-info-300 bg-white dark:bg-primary-800">
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-100">
              Change Password - {selectedUserName}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
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

            <Input
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
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
              onClick={() => onSubmit({ newPassword: passwordForm.newPassword, confirmPassword: passwordForm.confirmPassword })}
              loading={loading}
            >
              Change Password
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
