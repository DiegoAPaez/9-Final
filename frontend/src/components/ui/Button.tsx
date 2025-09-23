import { forwardRef } from 'react'
import { clsx } from 'clsx'
import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',

          // Size variants
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },

          // Color variants
          {
            // Primary button - main actions
            'bg-button-primary text-text-inverse hover:bg-button-primary-hover focus:ring-primary-500 disabled:bg-primary-300 disabled:text-primary-100':
              variant === 'primary',

            // Secondary button - secondary actions
            'bg-button-secondary text-text border border-border hover:bg-button-secondary-hover focus:ring-primary-500 disabled:bg-background-muted disabled:text-text-muted':
              variant === 'secondary',

            // Danger button - destructive actions
            'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 disabled:bg-error-300 disabled:text-error-100':
              variant === 'danger',

            // Ghost button - minimal actions
            'text-text-secondary hover:bg-background-secondary hover:text-text focus:ring-primary-500 disabled:text-text-muted':
              variant === 'ghost',
          },

          // Disabled state
          {
            'cursor-not-allowed opacity-50': disabled || loading,
          },

          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
