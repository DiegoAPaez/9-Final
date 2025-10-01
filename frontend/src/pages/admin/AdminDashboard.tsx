import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/Loading';
import { Alert } from '../../components/ui/Alert';
import {
  UsersIcon,
  ClockIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  TableCellsIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { userAPI, ordersAPI, paymentsAPI, tablesAPI, type UserInfo } from '../../services/api';

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  revenue: number;
  activeTables: number;
  totalTables: number;
  activeStaff: number;
  totalStaff: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeOrders: 0,
    revenue: 0,
    activeTables: 0,
    totalTables: 0,
    activeStaff: 0,
    totalStaff: 0,
  });
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current user info
        const userInfo = await userAPI.getCurrentUser();
        setCurrentUser(userInfo);

        // Get today's date range for basic stats
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

        // Fetch basic statistics only
        const [orders, payments, tables, users] = await Promise.all([
          ordersAPI.getOrdersByDateRange(startOfDay, endOfDay),
          paymentsAPI.getPaymentsByDateRange(startOfDay, endOfDay),
          tablesAPI.getAllTables(),
          userAPI.getUsers(),
        ]);

        // Calculate basic statistics for overview cards
        const totalOrders = orders.length;
        const activeOrders = orders.filter((order) =>
          ['PENDING', 'PREPARING', 'READY'].includes(order.orderState)
        ).length;

        const revenue = payments
          .filter((payment) => payment.paymentStatus === 'COMPLETED')
          .reduce((sum: number, payment) => sum + payment.amount, 0);

        const activeTables = tables.filter((table) => table.tableState === 'OCCUPIED').length;
        const totalTables = tables.length;

        const activeStaff = users.filter((user: UserInfo) =>
          user.roles.some((role: string) => ['WAITER', 'CASHIER'].includes(role))
        ).length;
        const totalStaff = users.length;

        setStats({
          totalOrders,
          activeOrders,
          revenue,
          activeTables,
          totalTables,
          activeStaff,
          totalStaff,
        });

      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard overview. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-primary-50 dark:bg-primary-900 min-h-screen p-6">
      {error && (
        <Alert variant="error" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Welcome Header */}
      <div className="bg-white dark:bg-primary-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-600 p-6">
        <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-100">
          Welcome back, {currentUser?.username || 'Admin'}!
        </h1>
        <p className="mt-2 text-primary-500 dark:text-primary-300">
          Here's your restaurant overview for today
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600">
              <CardContent className="flex items-center p-6">
                <div className="p-3 rounded-full bg-success-100 dark:bg-success-900 mr-4">
                  <ShoppingBagIcon className="h-6 w-6 text-success-600 dark:text-success-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-500 dark:text-primary-300">Total Orders</p>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-100">
                    {stats.totalOrders}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600">
              <CardContent className="flex items-center p-6">
                <div className="p-3 rounded-full bg-warning-100 dark:bg-warning-900 mr-4">
                  <ClockIcon className="h-6 w-6 text-warning-600 dark:text-warning-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-500 dark:text-primary-300">Active Orders</p>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-100">
                    {stats.activeOrders}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600">
              <CardContent className="flex items-center p-6">
                <div className="p-3 rounded-full bg-success-100 dark:bg-success-900 mr-4">
                  <CurrencyDollarIcon className="h-6 w-6 text-success-600 dark:text-success-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-500 dark:text-primary-300">Today's Revenue</p>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-100">
                    €{stats.revenue.toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600">
              <CardContent className="flex items-center p-6">
                <div className="p-3 rounded-full bg-info-100 dark:bg-info-900 mr-4">
                  <TableCellsIcon className="h-6 w-6 text-info-600 dark:text-info-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-500 dark:text-primary-300">Active Tables</p>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-100">
                    {stats.activeTables}/{stats.totalTables}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors"
              onClick={() => navigate('/admin/users')}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-primary-700 dark:text-primary-100">
                  <UsersIcon className="h-5 w-5 mr-2" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-500 dark:text-primary-300">
                  Manage staff accounts and permissions
                </p>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-primary-600 dark:text-primary-200">
                    {stats.totalStaff} total staff members
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors"
              onClick={() => navigate('/admin/shifts')}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-primary-700 dark:text-primary-100">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  Shift Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-500 dark:text-primary-300">
                  Schedule and manage employee work shifts
                </p>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-primary-600 dark:text-primary-200">
                    {stats.activeStaff} staff members on duty
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors"
              onClick={() => navigate('/admin/menus')}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-primary-700 dark:text-primary-100">
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Menu Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-500 dark:text-primary-300">
                  Manage restaurant menu items and pricing
                </p>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-primary-600 dark:text-primary-200">
                    Manage your restaurant's menu
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center text-primary-700 dark:text-primary-100">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Reports & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-500 dark:text-primary-300">
                  View sales reports and business insights
                </p>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-primary-600 dark:text-primary-200">
                    Coming soon
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors"
              onClick={() => navigate('/admin/tables')}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-primary-700 dark:text-primary-100">
                  <TableCellsIcon className="h-5 w-5 mr-2" />
                  Table Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-500 dark:text-primary-300">
                  Configure restaurant tables and layout
                </p>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-primary-600 dark:text-primary-200">
                    {stats.totalTables} tables configured
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Summary */}
          <Card className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600">
            <CardHeader>
              <CardTitle className="text-primary-700 dark:text-primary-100">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success-600 dark:text-success-300">
                    {stats.totalOrders}
                  </div>
                  <div className="text-sm text-primary-500 dark:text-primary-300">Orders Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning-600 dark:text-warning-300">
                    {stats.activeOrders}
                  </div>
                  <div className="text-sm text-primary-500 dark:text-primary-300">Orders In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-info-600 dark:text-info-300">
                    {stats.activeStaff}
                  </div>
                  <div className="text-sm text-primary-500 dark:text-primary-300">Staff On Duty</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
