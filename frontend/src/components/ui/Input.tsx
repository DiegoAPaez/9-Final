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
            className="block text-sm font-medium text-text mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-text-muted">
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
                'bg-input-background border-input-border text-text placeholder:text-text-muted focus:border-input-border-focus focus:ring-primary-200':
                  !error,

                // Error state
                'bg-error-50 border-error-300 text-error-900 placeholder:text-error-400 focus:border-error-500 focus:ring-error-200':
                  error,

                // Disabled state
                'bg-background-muted border-border-muted text-text-muted cursor-not-allowed':
                  props.disabled,
              },

              className
            )}
            ref={ref}
            {...props}
          />

          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-text-muted">
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
                'text-error-600': error,
                'text-text-muted': helperText && !error,
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
