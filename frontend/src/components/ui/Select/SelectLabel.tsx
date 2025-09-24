import React from 'react';
import { clsx } from 'clsx';

interface SelectLabelProps {
  label?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  description?: string;
}

const SelectLabel: React.FC<SelectLabelProps> = ({
  label,
  required,
  error,
  disabled,
  description,
}) => {
  if (!label && !description) return null;

  return (
    <>
      {label && (
        <label className={clsx(
          'block text-sm font-medium mb-2',
          error ? 'text-error-700' : 'text-text',
          disabled && 'opacity-50'
        )}>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {description && (
        <p
          id="select-description"
          className={clsx(
            'mt-2 text-xs text-text-secondary',
            error && 'text-error-600',
            disabled && 'opacity-50'
          )}
        >
          {description}
        </p>
      )}
    </>
  );
};

export default SelectLabel;
