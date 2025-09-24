import React, { useState, useRef, useEffect } from 'react';
import SelectTrigger from './SelectTrigger';
import SelectDropdown from './SelectDropdown';
import SelectLabel from './SelectLabel';
import type {SelectOption} from './SelectOption';

interface SelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  description?: string;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  searchable = false,
  clearable = false,
  disabled = false,
  error = false,
  size = 'md',
  className,
  label,
  description,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOption = options.find(option => option.value === value);

  const openDropdown = () => {
    if (!disabled) {
      setIsOpen(true);
      setHighlightedIndex(-1);
      if (searchable) {
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    closeDropdown();
    triggerRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else if (highlightedIndex >= 0) {
          const option = filteredOptions[highlightedIndex];
          if (!option.disabled) {
            handleOptionSelect(option.value);
          }
        }
        break;
      case 'Escape':
        closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          setHighlightedIndex(prev => {
            const nextIndex = prev < filteredOptions.length - 1 ? prev + 1 : 0;
            return filteredOptions[nextIndex].disabled ? nextIndex + 1 : nextIndex;
          });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => {
            const nextIndex = prev > 0 ? prev - 1 : filteredOptions.length - 1;
            return filteredOptions[nextIndex].disabled ? nextIndex - 1 : nextIndex;
          });
        }
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <SelectLabel
        label={label}
        required={required}
        error={error}
        disabled={disabled}
        description={description}
      />

      <SelectTrigger
        isOpen={isOpen}
        disabled={disabled}
        error={error}
        size={size}
        className={className}
        placeholder={placeholder}
        selectedLabel={selectedOption?.label}
        clearable={clearable}
        onClear={handleClear}
        onOpen={openDropdown}
        onKeyDown={handleKeyDown}
        triggerRef={triggerRef}
        description={description}
      />

      <SelectDropdown
        isOpen={isOpen}
        size={size}
        searchable={searchable}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onKeyDown={handleKeyDown}
        searchInputRef={searchInputRef}
        filteredOptions={filteredOptions}
        selectedValue={value}
        highlightedIndex={highlightedIndex}
        onOptionSelect={handleOptionSelect}
      />
    </div>
  );
};

export default Select;
