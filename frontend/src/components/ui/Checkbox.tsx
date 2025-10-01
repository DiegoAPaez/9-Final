import React from 'react';
import { clsx } from 'clsx';
import { CheckIcon, MinusIcon } from '@heroicons/react/24/outline';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
  label?: string;
  description?: string;
  id?: string;
  error?: boolean;
  required?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  indeterminate = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  className,
  label,
  description,
  id,
  error = false,
  required = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantClasses = {
    default: {
      unchecked: 'border-border bg-input-background',
      checked: 'bg-primary-500 border-primary-500',
      indeterminate: 'bg-primary-500 border-primary-500',
      disabled: 'bg-palette-100 border-palette-200',
      error: 'border-error-500',
    },
    success: {
      unchecked: 'border-border bg-input-background',
      checked: 'bg-success-500 border-success-500',
      indeterminate: 'bg-success-500 border-success-500',
      disabled: 'bg-palette-100 border-palette-200',
      error: 'border-error-500',
    },
    warning: {
      unchecked: 'border-border bg-input-background',
      checked: 'bg-warning-500 border-warning-500',
      indeterminate: 'bg-warning-500 border-warning-500',
      disabled: 'bg-palette-100 border-palette-200',
      error: 'border-error-500',
    },
    error: {
      unchecked: 'border-border bg-input-background',
      checked: 'bg-error-500 border-error-500',
      indeterminate: 'bg-error-500 border-error-500',
      disabled: 'bg-palette-100 border-palette-200',
      error: 'border-error-500',
    },
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const getCheckboxState = () => {
    if (disabled) return 'disabled';
    if (error) return 'error';
    if (indeterminate) return 'indeterminate';
    if (checked) return 'checked';
    return 'unchecked';
  };

  const checkboxClasses = clsx(
    'relative inline-flex items-center justify-center border-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    sizeClasses[size],
    variantClasses[variant][getCheckboxState()],
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary-300',
    className
  );

  const checkboxElement = (
    <button
      type="button"
      className={checkboxClasses}
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-disabled={disabled}
      aria-describedby={description ? `${id}-description` : undefined}
      aria-required={required}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      id={id}
    >
      {(checked || indeterminate) && (
        <span className="text-white">
          {indeterminate ? (
            <MinusIcon className={iconSizes[size]} strokeWidth={3} />
          ) : (
            <CheckIcon className={iconSizes[size]} strokeWidth={3} />
          )}
        </span>
      )}
    </button>
  );

  if (label || description) {
    return (
      <div className="flex items-start gap-3">
        {checkboxElement}
        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={id}
              className={clsx(
                'block text-sm font-medium text-text',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                error && 'text-error-700'
              )}
            >
              {label}
              {required && <span className="text-error-500 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p
              id={`${id}-description`}
              className={clsx(
                'text-sm text-text-secondary mt-1',
                disabled && 'opacity-50',
                error && 'text-error-600'
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return checkboxElement;
};

export default Checkbox;
