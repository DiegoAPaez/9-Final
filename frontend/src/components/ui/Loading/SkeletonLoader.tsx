import React from 'react';
import { clsx } from 'clsx';

interface SkeletonLoaderProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Number of skeleton lines to display
   */
  lines?: number;
  /**
   * Width of the skeleton lines
   */
  width?: string;
  /**
   * Height of each skeleton line
   */
  height?: string;
}

/**
 * Skeleton loader for content placeholders while data is loading
 *
 * @example
 * ```tsx
 * // Single line skeleton
 * <SkeletonLoader />
 *
 * // Multiple lines with custom width
 * <SkeletonLoader lines={3} width="w-3/4" />
 *
 * // Custom height for larger content
 * <SkeletonLoader lines={1} height="h-12" width="w-full" />
 * ```
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  lines = 1,
  width = 'w-full',
  height = 'h-4'
}) => {
  return (
    <div className={clsx('space-y-2', className)} role="status" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            'bg-primary-100 rounded animate-pulse',
            height,
            width,
            // Make the last line shorter for more natural appearance
            index === lines - 1 && lines > 1 && 'w-3/4'
          )}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SkeletonLoader;
