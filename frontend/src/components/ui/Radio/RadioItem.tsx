import React from 'react';
import { clsx } from 'clsx';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioItemProps {
  option: RadioOption;
  checked: boolean;
  onChange: (value: string) => void;
  name: string;
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'success' | 'warning' | 'error';
  disabled?: boolean;
  error?: boolean;
}

const RadioItem: React.FC<RadioItemProps> = ({
  option,
  checked,
  onChange,
  name,
  size,
  variant,
  disabled = false,
  error = false,
}) => {
  const sizeClasses = {
    sm: {
      radio: 'w-4 h-4',
      dot: 'w-1.5 h-1.5',
      text: 'text-sm',
      description: 'text-xs',
    },
    md: {
      radio: 'w-5 h-5',
      dot: 'w-2 h-2',
      text: 'text-sm',
      description: 'text-xs',
    },
    lg: {
      radio: 'w-6 h-6',
      dot: 'w-2.5 h-2.5',
      text: 'text-base',
      description: 'text-sm',
    },
  };

  const variantClasses = {
    default: {
      unchecked: 'border-border bg-input-background',
      checked: 'bg-primary-50 border-primary-500',
      dot: 'bg-primary-500',
      disabled: 'bg-palette-100 border-palette-200',
      error: 'border-error-500',
    },
    success: {
      unchecked: 'border-border bg-input-background',
      checked: 'bg-success-50 border-success-500',
      dot: 'bg-success-500',
      disabled: 'bg-palette-100 border-palette-200',
      error: 'border-error-500',
    },
    warning: {
      unchecked: 'border-border bg-input-background',
      checked: 'bg-warning-50 border-warning-500',
      dot: 'bg-warning-500',
      disabled: 'bg-palette-100 border-palette-200',
      error: 'border-error-500',
    },
    error: {
      unchecked: 'border-border bg-input-background',
      checked: 'bg-error-50 border-error-500',
      dot: 'bg-error-500',
      disabled: 'bg-palette-100 border-palette-200',
      error: 'border-error-500',
    },
  };

  const handleClick = () => {
    if (!disabled && !option.disabled) {
      onChange(option.value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const isDisabled = disabled || option.disabled;
  const getRadioState = () => {
    if (isDisabled) return 'disabled';
    if (error) return 'error';
    if (checked) return 'checked';
    return 'unchecked';
  };

  const radioClasses = clsx(
    'relative inline-flex items-center justify-center border-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    sizeClasses[size].radio,
    variantClasses[variant][getRadioState()],
    isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary-300'
  );

  const dotClasses = clsx(
    'rounded-full transition-all duration-200',
    sizeClasses[size].dot,
    checked ? variantClasses[variant].dot : 'scale-0'
  );

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        className={radioClasses}
        role="radio"
        aria-checked={checked}
        aria-disabled={isDisabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        name={name}
      >
        <span className={dotClasses} />
      </button>
      <div className="flex-1 min-w-0">
        <label
          className={clsx(
            'block font-medium cursor-pointer',
            sizeClasses[size].text,
            isDisabled ? 'opacity-50 cursor-not-allowed text-text-muted' : 'text-text',
            error && 'text-error-700'
          )}
          onClick={handleClick}
        >
          {option.label}
        </label>
        {option.description && (
          <p
            className={clsx(
              'text-text-secondary mt-1',
              sizeClasses[size].description,
              isDisabled && 'opacity-50',
              error && 'text-error-600'
            )}
          >
            {option.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default RadioItem;
