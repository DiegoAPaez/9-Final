import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { clsx } from 'clsx';
import Navbar from './Navbar';
import { authAPI, type UserInfo } from '../../services/api';
import { LoadingOverlay } from '../ui/Loading';
import { Alert } from '../ui/Alert';

const AppLayout: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on mount and route changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const user = await authAPI.getCurrentUser();
        setUserInfo(user);
      } catch (err) {
        console.error('Authentication check failed:', err);
        setUserInfo(undefined);
        navigate('/', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    void checkAuth();
  }, [navigate, location.pathname]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navLinks: Record<string, { label: string; path: string }[]> = {
    ADMIN: [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Users', path: '/admin/users' },
      { label: 'Shifts', path: '/admin/shifts' },
      { label: 'Tables', path: '/admin/tables' },
      { label: 'Menu', path: '/admin/menus' },
      { label: 'Reports', path: '/admin/reports' },
    ],
    WAITER: [
      { label: 'Dashboard', path: '/waiter/dashboard' },
      { label: 'Tables', path: '/waiter/tables' },
      { label: 'Shifts', path: '/waiter/shifts' },
    ],
    CASHIER: [
      { label: 'Dashboard', path: '/cashier/dashboard' },
      { label: 'Payments', path: '/cashier/payments' },
      { label: 'Reports', path: '/cashier/reports' },
    ],
  };

  const userLinks = userInfo?.roles
    ? Array.from(new Map(userInfo.roles.flatMap(role => navLinks[role] || []).map(link => [link.path, link])).values())
    : [];

  if (isLoading) {
    return <LoadingOverlay isVisible={true} text="Loading application..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-50 dark:bg-primary-900 flex items-center justify-center p-4">
        <Alert variant="error" className="max-w-md">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900">
      <Navbar
        userInfo={userInfo}
        onMenuToggle={handleMenuToggle}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex">
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />

            <div className={clsx(
              'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-primary-800 border-r border-primary-200 dark:border-primary-600',
              'transform transition-transform duration-300 ease-in-out',
              'lg:relative lg:translate-x-0'
            )}>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-primary-700 dark:text-primary-100 mb-4">Navigation</h2>
                <div className="space-y-2 text-primary-500 dark:text-primary-300">
                  {userLinks.length > 0 ? (
                    userLinks.map(link => (
                      <button
                        key={link.path}
                        className={clsx('block w-full text-left px-2 py-1 rounded hover:bg-primary-100 dark:hover:bg-primary-700 transition')}
                        onClick={() => navigate(link.path)}
                      >
                        • {link.label}
                      </button>
                    ))
                  ) : (
                    <div>No navigation available</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <main className={clsx(
          'flex-1 min-h-0',
          'transition-all duration-300 ease-in-out'
        )}>
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
