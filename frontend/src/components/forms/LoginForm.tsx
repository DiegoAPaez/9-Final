import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Alert } from '../ui/Alert';

const loginSchema = {
  username: {
    required: 'Username is required',
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters',
    },
    maxLength: {
      value: 50,
      message: 'Username must not exceed 50 characters',
    },
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
    maxLength: {
      value: 100,
      message: 'Password must not exceed 100 characters',
    },
  },
};

type LoginFormData = {
  username: string;
  password: string;
};

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      // Error is handled by parent component
      console.error('Login form submission error:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`space-y-6 ${className || ''}`}
      noValidate
    >
      {error && (
        <Alert variant="error" dismissible>
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        <Input
          {...register('username', loginSchema.username)}
          type="text"
          label="Username"
          placeholder="Enter your username"
          error={errors.username?.message}
          disabled={isFormDisabled}
          required
          autoComplete="username"
          autoFocus
        />

        <Input
          {...register('password', loginSchema.password)}
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          disabled={isFormDisabled}
          required
          autoComplete="current-password"
          endIcon={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="p-1 text-text-secondary hover:text-text transition-colors focus:outline-none focus:text-text"
              disabled={isFormDisabled}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          }
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isFormDisabled}
        disabled={isFormDisabled}
        className="w-full"
      >
        {isFormDisabled ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
