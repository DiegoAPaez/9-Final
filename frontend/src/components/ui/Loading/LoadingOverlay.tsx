import React from 'react';
import { clsx } from 'clsx';
import LoadingSpinner from './LoadingSpinner.tsx';

interface LoadingOverlayProps {
  /**
   * Loading text to display below the spinner
   */
  text?: string;
  /**
   * Whether the overlay is visible
   */
  isVisible?: boolean;
  /**
   * Size of the loading spinner
   */
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Additional CSS classes for the overlay container
   */
  className?: string;
  /**
   * Background opacity variant
   */
  backgroundVariant?: 'light' | 'medium' | 'dark';
}

/**
 * Full-screen loading overlay component for page-level loading states
 *
 * @example
 * ```tsx
 * // Basic overlay
 * <LoadingOverlay isVisible={isLoading} text="Loading data..." />
 *
 * // Custom styling
 * <LoadingOverlay
 *   isVisible={isLoading}
 *   text="Processing payment..."
 *   spinnerSize="xl"
 *   backgroundVariant="dark"
 * />
 * ```
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  text = "Loading...",
  isVisible = true,
  spinnerSize = 'lg',
  className,
  backgroundVariant = 'medium'
}) => {
  if (!isVisible) return null;

  const backgroundClasses = {
    light: 'bg-background/60',
    medium: 'bg-background/80',
    dark: 'bg-background/90'
  };

  return (
    <div
      className={clsx(
        'fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50',
        backgroundClasses[backgroundVariant],
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
    >
      <div className="bg-card-background p-8 rounded-lg shadow-lg border border-card-border max-w-sm mx-4">
        <LoadingSpinner size={spinnerSize} text={text} />
      </div>
    </div>
  );
};

export default LoadingOverlay;
