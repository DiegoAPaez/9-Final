import React from 'react';
import { clsx } from 'clsx';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface SelectTriggerProps {
  isOpen: boolean;
  disabled: boolean;
  error: boolean;
  size: 'sm' | 'md' | 'lg';
  className?: string;
  placeholder: string;
  selectedLabel?: string;
  clearable: boolean;
  onClear: (e: React.MouseEvent) => void;
  onOpen: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  description?: string;
}

const SelectTrigger: React.FC<SelectTriggerProps> = ({
  isOpen,
  disabled,
  error,
  size,
  className,
  placeholder,
  selectedLabel,
  clearable,
  onClear,
  onOpen,
  onKeyDown,
  triggerRef,
  description,
}) => {
  const sizeClasses = {
    sm: {
      trigger: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      trigger: 'px-3 py-2 text-sm',
      icon: 'w-5 h-5',
    },
    lg: {
      trigger: 'px-4 py-2.5 text-base',
      icon: 'w-5 h-5',
    },
  };

  const triggerClasses = clsx(
    'relative w-full border rounded-lg bg-input-background transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-between',
    sizeClasses[size].trigger,
    error ? 'border-error-500' : 'border-border',
    disabled ? 'cursor-not-allowed opacity-50 bg-palette-100' : 'cursor-pointer hover:border-primary-300',
    className
  );

  return (
    <button
      ref={triggerRef}
      type="button"
      className={triggerClasses}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-describedby={description ? 'select-description' : undefined}
    >
      <span className={clsx(
        'flex-1 text-left truncate',
        !selectedLabel && 'text-text-secondary'
      )}>
        {selectedLabel || placeholder}
      </span>

      <div className="flex items-center gap-1">
        {clearable && selectedLabel && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="p-0.5 hover:bg-primary-100 rounded transition-colors"
            tabIndex={-1}
          >
            <XMarkIcon className={sizeClasses[size].icon} />
          </button>
        )}
        <ChevronDownIcon
          className={clsx(
            sizeClasses[size].icon,
            'transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
        />
      </div>
    </button>
  );
};

export default SelectTrigger;
