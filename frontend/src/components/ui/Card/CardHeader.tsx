import { forwardRef } from 'react'
import { clsx } from 'clsx'
import * as React from "react";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={clsx(
          'flex flex-col space-y-1.5 pb-4',
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

CardHeader.displayName = 'CardHeader'

export default CardHeader
