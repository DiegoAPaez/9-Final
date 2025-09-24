import React from 'react';
import { clsx } from 'clsx';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AlertProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
  size = 'md',
  showIcon = true,
}) => {
  const icons = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
  };

  const variantClasses = {
    success: {
      container: 'bg-success-50 border-success-200 text-success-800',
      title: 'text-success-800',
      icon: 'text-success-400',
      dismissButton: 'text-success-500 hover:text-success-600',
    },
    warning: {
      container: 'bg-warning-50 border-warning-200 text-warning-800',
      title: 'text-warning-800',
      icon: 'text-warning-400',
      dismissButton: 'text-warning-500 hover:text-warning-600',
    },
    error: {
      container: 'bg-error-50 border-error-200 text-error-800',
      title: 'text-error-800',
      icon: 'text-error-400',
      dismissButton: 'text-error-500 hover:text-error-600',
    },
    info: {
      container: 'bg-info-50 border-info-200 text-info-800',
      title: 'text-info-800',
      icon: 'text-info-400',
      dismissButton: 'text-info-500 hover:text-info-600',
    },
  };

  const sizeClasses = {
    sm: {
      container: 'p-3',
      icon: 'w-4 h-4',
      title: 'text-sm font-medium',
      content: 'text-sm',
      dismissButton: 'w-4 h-4',
    },
    md: {
      container: 'p-4',
      icon: 'w-5 h-5',
      title: 'text-base font-medium',
      content: 'text-sm',
      dismissButton: 'w-5 h-5',
    },
    lg: {
      container: 'p-5',
      icon: 'w-6 h-6',
      title: 'text-lg font-medium',
      content: 'text-base',
      dismissButton: 'w-6 h-6',
    },
  };

  const IconComponent = icons[variant];
  const variantStyle = variantClasses[variant];
  const sizeStyle = sizeClasses[size];

  const containerClasses = clsx(
    'border rounded-lg flex gap-3',
    variantStyle.container,
    sizeStyle.container,
    className
  );

  const handleDismiss = () => {
    onDismiss?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && dismissible) {
      handleDismiss();
    }
  };

  return (
    <div
      className={containerClasses}
      role="alert"
      onKeyDown={handleKeyDown}
      tabIndex={dismissible ? 0 : -1}
    >
      {/* Icon */}
      {showIcon && (
        <div className="flex-shrink-0">
          <IconComponent
            className={clsx(sizeStyle.icon, variantStyle.icon)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className={clsx(sizeStyle.title, variantStyle.title, 'mb-1')}>
            {title}
          </h3>
        )}
        <div className={sizeStyle.content}>
          {children}
        </div>
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={handleDismiss}
            className={clsx(
              'rounded-md p-1.5 inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2',
              variantStyle.dismissButton,
              `focus:ring-${variant}-500`
            )}
            aria-label="Dismiss alert"
          >
            <XMarkIcon className={sizeStyle.dismissButton} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};


export default Alert;
