import { forwardRef } from 'react'
import { clsx } from 'clsx'
import * as React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, startIcon, endIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-primary-700 dark:text-primary-100 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-primary-500 dark:text-primary-300">
                {startIcon}
              </div>
            </div>
          )}

          <input
            id={inputId}
            className={clsx(
              // Base styles
              'block w-full rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',

              // Size and spacing
              'px-3 py-2 text-sm',

              // Icon padding adjustments
              {
                'pl-10': startIcon,
                'pr-10': endIcon,
              },

              // State styles
              {
                // Normal state
                'bg-white dark:bg-primary-700 border-primary-200 dark:border-primary-600 text-primary-700 dark:text-primary-100 placeholder:text-primary-400 dark:placeholder:text-primary-400 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-400':
                  !error,

                // Error state
                'bg-error-50 dark:bg-error-900 border-error-300 dark:border-error-600 text-error-900 dark:text-error-100 placeholder:text-error-400 dark:placeholder:text-error-500 focus:border-error-500 focus:ring-error-200 dark:focus:ring-error-400':
                  error,

                // Disabled state
                'bg-primary-100 dark:bg-primary-800 border-primary-200 dark:border-primary-600 text-primary-400 dark:text-primary-500 cursor-not-allowed':
                  props.disabled,
              },

              className
            )}
            ref={ref}
            {...props}
          />

          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="h-5 w-5 text-primary-500 dark:text-primary-300">
                {endIcon}
              </div>
            </div>
          )}
        </div>

        {/* Helper text or error message */}
        {(error || helperText) && (
          <p
            className={clsx(
              'mt-1 text-xs',
              {
                'text-error-600 dark:text-error-400': error,
                'text-primary-500 dark:text-primary-300': helperText && !error,
              }
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
