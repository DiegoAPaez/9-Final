import React from 'react';
import { clsx } from 'clsx';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  className,
  showLabel = false,
  label,
  animated = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-info-500',
  };

  const trackClasses = clsx(
    'w-full rounded-full overflow-hidden bg-primary-100',
    sizeClasses[size],
    className
  );

  const fillClasses = clsx(
    'h-full rounded-full transition-all duration-300 ease-out',
    variantClasses[variant],
    animated && 'bg-gradient-to-r from-transparent to-white/20 bg-[length:200%_100%] animate-[shimmer_2s_infinite]'
  );

  const labelText = label || `${Math.round(percentage)}%`;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text">{labelText}</span>
          <span className="text-sm text-text-secondary">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={trackClasses}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(percentage)}%`}
      >
        <div
          className={fillClasses}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;
