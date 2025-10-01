import React from 'react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Color variant of the spinner
   */
  variant?: 'primary' | 'secondary' | 'white' | 'current';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Loading text to display below the spinner (optional)
   */
  text?: string;
  /**
   * Whether to show the spinner inline or as a block element
   */
  inline?: boolean;
}

/**
 * Loading spinner component for indicating loading states
 *
 * @example
 * ```tsx
 * // Basic spinner
 * <LoadingSpinner />
 *
 * // Inline spinner with text
 * <LoadingSpinner inline text="Loading..." size="sm" />
 *
 * // Large spinner for page loading
 * <LoadingSpinner size="xl" variant="primary" text="Please wait..." />
 * ```
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
  text,
  inline = false,
}) => {
  const baseClasses = 'animate-spin rounded-full border-solid border-t-transparent';

  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-12 h-12 border-4',
  };

  const variantClasses = {
    primary: 'border-primary-500',
    secondary: 'border-primary-300',
    white: 'border-white',
    current: 'border-current',
  };

  const containerClasses = clsx(
    inline ? 'inline-flex' : 'flex',
    'items-center justify-center gap-3',
    text && 'flex-col',
    className
  );

  const spinnerClasses = clsx(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant]
  );

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className={spinnerClasses} aria-hidden="true" />
      {text && (
        <span className="text-sm text-text-secondary font-medium">
          {text}
        </span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
