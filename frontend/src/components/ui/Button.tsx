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
          'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer',

          // Size variants
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },

          // Color variants
          {
            // Primary button - main actions
            'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-200 dark:focus:ring-primary-400 disabled:bg-primary-300 dark:disabled:bg-primary-700 disabled:text-primary-100 dark:disabled:text-primary-400':
              variant === 'primary',

            // Secondary button - secondary actions
            'bg-primary-100 dark:bg-primary-700 text-primary-700 dark:text-primary-100 border border-primary-200 dark:border-primary-200 hover:bg-primary-200 dark:hover:bg-primary-600 hover:text-primary-800 dark:hover:text-primary-50 focus:ring-primary-200 dark:focus:ring-primary-400 disabled:bg-primary-100 dark:disabled:bg-primary-800 disabled:text-primary-400 dark:disabled:text-primary-500':
              variant === 'secondary',

            // Danger button - destructive actions
            'bg-error-500 text-white hover:bg-error-600 focus:ring-error-200 dark:focus:ring-error-400 disabled:bg-error-300 dark:disabled:bg-error-700 disabled:text-error-100 dark:disabled:text-error-400':
              variant === 'danger',

            // Ghost button - minimal actions
            'text-primary-500 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-700 hover:text-primary-700 dark:hover:text-primary-100 focus:ring-primary-200 dark:focus:ring-primary-400 disabled:text-primary-400 dark:disabled:text-primary-500':
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
