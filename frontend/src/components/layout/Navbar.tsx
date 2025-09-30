import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { clsx } from 'clsx';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { authAPI } from '../../services/api';

interface NavbarProps {
  userInfo?: {
    id: number;
    username: string;
    email: string;
    roles: string[];
  };
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  userInfo,
  onMenuToggle,
  isSidebarOpen = false,
  className,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authAPI.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const getUserRole = () => {
    if (!userInfo?.roles) return 'User';
    if (userInfo.roles.includes('ADMIN')) return 'Admin';
    if (userInfo.roles.includes('CASHIER')) return 'Cashier';
    if (userInfo.roles.includes('WAITER')) return 'Waiter';
    return 'User';
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin')) return 'Admin Dashboard';
    if (path.includes('/cashier')) return 'Cashier Dashboard';
    if (path.includes('/waiter')) return 'Waiter Dashboard';
    return 'Restaurant POS';
  };

  return (
    <nav className={clsx(
      'bg-primary-100 dark:bg-primary-700 border-b border-primary-200 dark:border-primary-600 shadow-sm',
      'sticky top-0 z-40',
      className
    )}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Menu toggle and title */}
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden"
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {isSidebarOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </Button>

            {/* Page title */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-primary-700 dark:text-primary-100 hidden sm:block">
                {getPageTitle()}
              </h1>

              {/* Mobile: Show only restaurant name */}
              <h1 className="text-lg font-semibold text-primary-700 dark:text-primary-100 sm:hidden">
                Restaurant Management
              </h1>
            </div>
          </div>

          {/* Right section - User menu */}
          <div className="flex items-center gap-3">
            {/* User menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleUserMenu}
                className="flex items-center gap-2 pl-2 pr-3"
                aria-label="User menu"
              >
                {userInfo ? (
                  <Avatar
                    username={userInfo.username}
                    size="sm"
                    status="online"
                    showStatus
                  />
                ) : (
                  <UserCircleIcon className="w-6 h-6" />
                )}

                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-primary-700 dark:text-primary-100">
                    {userInfo?.username || 'User'}
                  </div>
                  <div className="text-xs text-primary-500 dark:text-primary-300">
                    {getUserRole()}
                  </div>
                </div>
              </Button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-primary-800 rounded-lg shadow-lg border border-primary-200 dark:border-primary-600 z-20">
                    <div className="p-4 border-b border-primary-200 dark:border-primary-600">
                      <div className="flex items-center gap-3">
                        {userInfo && (
                          <Avatar
                            username={userInfo.username}
                            size="md"
                            status="online"
                            showStatus
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-primary-700 dark:text-primary-100 truncate">
                            {userInfo?.username || 'User'}
                          </div>
                          <div className="text-sm text-primary-500 dark:text-primary-300 truncate">
                            {userInfo?.email || 'No email'}
                          </div>
                          <Badge variant="secondary" size="sm" className="mt-1">
                            {getUserRole()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        loading={isLoggingOut}
                        disabled={isLoggingOut}
                        className="w-full justify-start gap-3 text-error-600 hover:text-error-700 hover:bg-error-50 dark:text-error-400 dark:hover:text-error-300 dark:hover:bg-error-900"
                      >
                        <PowerIcon className="w-4 h-4" />
                        {isLoggingOut ? 'Signing out...' : 'Sign out'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
