import React from 'react';
import { clsx } from 'clsx';

interface SteppedProgressProps {
  currentStep: number;
  totalSteps: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  stepLabels?: string[];
}

const SteppedProgress: React.FC<SteppedProgressProps> = ({
  currentStep,
  totalSteps,
  variant = 'default',
  className,
  stepLabels,
}) => {
  const variantClasses = {
    default: {
      active: 'bg-primary-500 border-primary-500',
      completed: 'bg-primary-500 border-primary-500',
      pending: 'bg-primary-100 border-primary-200',
    },
    success: {
      active: 'bg-success-500 border-success-500',
      completed: 'bg-success-500 border-success-500',
      pending: 'bg-success-100 border-success-200',
    },
    warning: {
      active: 'bg-warning-500 border-warning-500',
      completed: 'bg-warning-500 border-warning-500',
      pending: 'bg-warning-100 border-warning-200',
    },
    error: {
      active: 'bg-error-500 border-error-500',
      completed: 'bg-error-500 border-error-500',
      pending: 'bg-error-100 border-error-200',
    },
    info: {
      active: 'bg-info-500 border-info-500',
      completed: 'bg-info-500 border-info-500',
      pending: 'bg-info-100 border-info-200',
    },
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep - 1) return 'completed';
    if (stepIndex === currentStep - 1) return 'active';
    return 'pending';
  };

  return (
    <div className={clsx('flex items-center', className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const status = getStepStatus(index);
        const isLast = index === totalSteps - 1;

        return (
          <div key={index} className="flex items-center">
            <div className="relative flex flex-col items-center">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                  variantClasses[variant][status]
                )}
              >
                <span className={clsx(
                  'text-xs font-medium',
                  status === 'pending' ? 'text-text-muted' : 'text-white'
                )}>
                  {index + 1}
                </span>
              </div>
              {stepLabels && stepLabels[index] && (
                <span className="text-xs text-text-secondary mt-2 text-center max-w-16 leading-tight">
                  {stepLabels[index]}
                </span>
              )}
            </div>
            {!isLast && (
              <div className={clsx(
                'h-0.5 w-8 mx-2 transition-all duration-200',
                status === 'completed' ? variantClasses[variant].completed : variantClasses[variant].pending
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SteppedProgress;
