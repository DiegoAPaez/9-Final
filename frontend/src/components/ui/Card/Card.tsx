import { forwardRef } from 'react'
import { clsx } from 'clsx'
import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    return (
      <div
        className={clsx(
          // Base styles
          'rounded-lg transition-shadow duration-200',

          // Variant styles
          {
            // Default card - standard background with subtle border
            'bg-card-background border border-card-border': variant === 'default',

            // Elevated card - raised appearance with shadow
            'bg-surface-elevated shadow-md hover:shadow-lg border border-card-border': variant === 'elevated',

            // Outlined card - emphasis on border, minimal background
            'bg-background border-2 border-border': variant === 'outlined',
          },

          // Padding variants
          {
            'p-0': padding === 'none',
            'p-3': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },

          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
