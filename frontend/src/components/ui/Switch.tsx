import React from 'react';
import { clsx } from 'clsx';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
  label?: string;
  description?: string;
  id?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  variant = 'default',
  className,
  label,
  description,
  id,
}) => {
  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  const variantClasses = {
    default: {
      trackActive: 'bg-primary-500',
      trackInactive: 'bg-palette-200',
      trackDisabled: 'bg-palette-100',
    },
    success: {
      trackActive: 'bg-success-500',
      trackInactive: 'bg-palette-200',
      trackDisabled: 'bg-palette-100',
    },
    warning: {
      trackActive: 'bg-warning-500',
      trackInactive: 'bg-palette-200',
      trackDisabled: 'bg-palette-100',
    },
    error: {
      trackActive: 'bg-error-500',
      trackInactive: 'bg-palette-200',
      trackDisabled: 'bg-palette-100',
    },
  };

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  };

  const trackClasses = clsx(
    'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    sizeClasses[size].track,
    disabled
      ? variantClasses[variant].trackDisabled
      : checked
      ? variantClasses[variant].trackActive
      : variantClasses[variant].trackInactive,
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    className
  );

  const thumbClasses = clsx(
    'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
    sizeClasses[size].thumb,
    checked ? sizeClasses[size].translate : 'translate-x-0'
  );

  const switchElement = (
    <button
      type="button"
      className={trackClasses}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      aria-describedby={description ? `${id}-description` : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      id={id}
    >
      <span className={thumbClasses} />
    </button>
  );

  if (label || description) {
    return (
      <div className="flex items-start gap-3">
        {switchElement}
        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={id}
              className={clsx(
                'block text-sm font-medium text-text',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${id}-description`}
              className={clsx(
                'text-sm text-text-secondary',
                disabled && 'opacity-50'
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return switchElement;
};

export default Switch;
