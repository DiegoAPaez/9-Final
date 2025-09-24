import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  username: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'circular' | 'rounded' | 'square';
  className?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
  showStatus?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  username,
  size = 'md',
  variant = 'circular',
  className,
  status,
  showStatus = false,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const variantClasses = {
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    square: 'rounded-none',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-palette-400',
    busy: 'bg-error-500',
    away: 'bg-warning-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const avatarClasses = clsx(
    'relative inline-flex items-center justify-center font-medium text-white bg-primary-500 shrink-0',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  return (
    <div className={avatarClasses}>
      <span className="select-none">{getInitials(username)}</span>

      {showStatus && status && (
        <span
          className={clsx(
            'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white',
            statusColors[status],
            statusSizes[size]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;
