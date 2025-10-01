import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  icon: Icon,
  dot = false,
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 font-medium rounded-full';

  const variantClasses = {
    default: 'bg-primary-100 text-primary-800 border border-primary-200',
    success: 'bg-success-50 text-success-700 border border-success-200',
    warning: 'bg-warning-50 text-warning-700 border border-warning-200',
    error: 'bg-error-50 text-error-700 border border-error-200',
    info: 'bg-info-50 text-info-700 border border-info-200',
    secondary: 'bg-palette-100 text-palette-700 border border-palette-200',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const dotVariantClasses = {
    default: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-info-500',
    secondary: 'bg-palette-500',
  };

  const badgeClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <span className={badgeClasses}>
      {dot && (
        <span
          className={clsx(
            'rounded-full flex-shrink-0',
            dotSizeClasses[size],
            dotVariantClasses[variant]
          )}
          aria-hidden="true"
        />
      )}
      {Icon && (
        <Icon
          className={clsx('flex-shrink-0', iconSizeClasses[size])}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{children}</span>
    </span>
  );
};

export default Badge;
