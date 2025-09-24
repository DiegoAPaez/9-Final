import React from 'react';
import { clsx } from 'clsx';
import RadioItem from './RadioItem';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  name: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

const Radio: React.FC<RadioProps> = ({
  value,
  onChange,
  options,
  name,
  size = 'md',
  variant = 'default',
  className,
  disabled = false,
  error = false,
  required = false,
  orientation = 'vertical',
}) => {
  const containerClasses = clsx(
    'space-y-3',
    orientation === 'horizontal' && 'flex flex-wrap gap-6 space-y-0',
    className
  );

  return (
    <div className={containerClasses} role="radiogroup" aria-required={required}>
      {options.map((option) => (
        <RadioItem
          key={option.value}
          option={option}
          checked={value === option.value}
          onChange={onChange}
          name={name}
          size={size}
          variant={variant}
          disabled={disabled}
          error={error}
        />
      ))}
    </div>
  );
};

export default Radio;
