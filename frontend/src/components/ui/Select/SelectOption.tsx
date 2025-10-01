import React from 'react';
import { clsx } from 'clsx';
import { CheckIcon } from '@heroicons/react/24/outline';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface SelectOptionProps {
  option: SelectOption;
  isSelected: boolean;
  isHighlighted: boolean;
  size: 'sm' | 'md' | 'lg';
  onSelect: (value: string) => void;
}

const SelectOptionComponent: React.FC<SelectOptionProps> = ({
  option,
  isSelected,
  isHighlighted,
  size,
  onSelect,
}) => {
  const sizeClasses = {
    sm: {
      option: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      option: 'px-3 py-2 text-sm',
      icon: 'w-5 h-5',
    },
    lg: {
      option: 'px-4 py-2.5 text-base',
      icon: 'w-5 h-5',
    },
  };

  const optionClasses = clsx(
    'cursor-pointer flex items-center justify-between transition-colors duration-150',
    sizeClasses[size].option,
    option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50',
    isHighlighted && !option.disabled && 'bg-primary-50',
    isSelected && 'bg-primary-100 text-primary-800'
  );

  const handleClick = () => {
    if (!option.disabled) {
      onSelect(option.value);
    }
  };

  return (
    <div
      className={optionClasses}
      onClick={handleClick}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled}
    >
      <div className="flex-1 min-w-0">
        <div className="truncate">{option.label}</div>
        {option.description && (
          <div className="text-xs text-text-secondary truncate">
            {option.description}
          </div>
        )}
      </div>
      {isSelected && (
        <CheckIcon className={clsx(sizeClasses[size].icon, 'text-primary-600')} />
      )}
    </div>
  );
};

export default SelectOptionComponent;
