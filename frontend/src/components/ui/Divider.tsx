import React from 'react';
import { clsx } from 'clsx';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: 'thin' | 'medium' | 'thick';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'thin',
  spacing = 'md',
  className,
  children,
}) => {
  const baseClasses = 'border-border';

  const orientationClasses = {
    horizontal: 'w-full border-t',
    vertical: 'h-full border-l',
  };

  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  const thicknessClasses = {
    thin: 'border-t-[1px]',
    medium: 'border-t-2',
    thick: 'border-t-4',
  };

  const verticalThicknessClasses = {
    thin: 'border-l-[1px]',
    medium: 'border-l-2',
    thick: 'border-l-4',
  };

  const spacingClasses = {
    horizontal: {
      none: '',
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-6',
      xl: 'my-8',
    },
    vertical: {
      none: '',
      sm: 'mx-2',
      md: 'mx-4',
      lg: 'mx-6',
      xl: 'mx-8',
    },
  };

  const dividerClasses = clsx(
    baseClasses,
    orientationClasses[orientation],
    variantClasses[variant],
    orientation === 'horizontal'
      ? thicknessClasses[thickness]
      : verticalThicknessClasses[thickness],
    spacingClasses[orientation][spacing],
    className
  );

  if (children) {
    return (
      <div className={clsx(
        'relative flex items-center',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        spacingClasses[orientation][spacing]
      )}>
        <div className={clsx(
          baseClasses,
          orientationClasses[orientation],
          variantClasses[variant],
          orientation === 'horizontal'
            ? thicknessClasses[thickness]
            : verticalThicknessClasses[thickness],
          orientation === 'horizontal' ? 'flex-1' : 'flex-1'
        )} />

        <div className={clsx(
          'flex-shrink-0 bg-background text-text-secondary text-sm font-medium',
          orientation === 'horizontal' ? 'px-4' : 'py-2'
        )}>
          {children}
        </div>

        <div className={clsx(
          baseClasses,
          orientationClasses[orientation],
          variantClasses[variant],
          orientation === 'horizontal'
            ? thicknessClasses[thickness]
            : verticalThicknessClasses[thickness],
          orientation === 'horizontal' ? 'flex-1' : 'flex-1'
        )} />
      </div>
    );
  }

  return <div className={dividerClasses} role="separator" />;
};

export default Divider;
