import React from 'react';
import { clsx } from 'clsx';
import Alert from './Alert';

interface ToastAlertProps {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  isVisible?: boolean;
}

const ToastAlert: React.FC<ToastAlertProps> = ({
  position = 'top-right',
  isVisible = true,
  className,
  ...props
}) => {
  if (!isVisible) return null;

  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
  };

  return (
    <div className={positionClasses[position]}>
      <Alert
        {...props}
        className={clsx('shadow-lg max-w-md animate-in slide-in-from-right', className)}
        dismissible={true}
      />
    </div>
  );
};

export default ToastAlert;
