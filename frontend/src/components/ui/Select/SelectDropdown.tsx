import React from 'react';
import { clsx } from 'clsx';
import SelectSearch from './SelectSearch';
import SelectOptionComponent, {type SelectOption } from './SelectOption';

interface SelectDropdownProps {
  isOpen: boolean;
  size: 'sm' | 'md' | 'lg';
  searchable: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filteredOptions: SelectOption[];
  selectedValue?: string;
  highlightedIndex: number;
  onOptionSelect: (value: string) => void;
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  isOpen,
  size,
  searchable,
  searchTerm,
  onSearchChange,
  onKeyDown,
  searchInputRef,
  filteredOptions,
  selectedValue,
  highlightedIndex,
  onOptionSelect,
}) => {
  const sizeClasses = {
    sm: {
      dropdown: 'text-sm',
      option: 'px-3 py-1.5 text-sm',
    },
    md: {
      dropdown: 'text-sm',
      option: 'px-3 py-2 text-sm',
    },
    lg: {
      dropdown: 'text-base',
      option: 'px-4 py-2.5 text-base',
    },
  };

  const dropdownClasses = clsx(
    'absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-auto',
    sizeClasses[size].dropdown
  );

  if (!isOpen) return null;

  return (
    <div className={dropdownClasses} role="listbox">
      {searchable && (
        <SelectSearch
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onKeyDown={onKeyDown}
          searchInputRef={searchInputRef}
        />
      )}

      {filteredOptions.length === 0 ? (
        <div className={clsx('text-text-secondary italic', sizeClasses[size].option)}>
          {searchable ? 'No options found' : 'No options available'}
        </div>
      ) : (
        filteredOptions.map((option, index) => (
          <SelectOptionComponent
            key={option.value}
            option={option}
            isSelected={option.value === selectedValue}
            isHighlighted={index === highlightedIndex}
            size={size}
            onSelect={onOptionSelect}
          />
        ))
      )}
    </div>
  );
};

export default SelectDropdown;
