import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import WelcomePage from './pages/WelcomePage';
import AppLayout from './components/layout/AppLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ShiftManagement from './pages/admin/ShiftManagement';
import MenuManagement from './pages/admin/MenuManagement';
import TableManagement from './pages/admin/TableManagement';

// Waiter Pages
import WaiterDashboard from './pages/waiter/WaiterDashboard';
import TablesPage from './pages/waiter/TablesPage';
import TableDetailPage from './pages/waiter/TableDetailPage';
import WaiterShiftsPage from './pages/waiter/WaiterShiftsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<WelcomePage />} />

          {/* Protected routes - wrapped in AppLayout */}
          <Route path="/admin" element={<AppLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="shifts" element={<ShiftManagement />} />
            <Route path="menus" element={<MenuManagement />} />
            <Route path="tables" element={<TableManagement />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          <Route path="/cashier" element={<AppLayout />}>
            <Route path="dashboard" element={<div>Cashier Dashboard - Coming Soon</div>} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          <Route path="/waiter" element={<AppLayout />}>
            <Route path="dashboard" element={<WaiterDashboard />} />
            <Route path="tables" element={<TablesPage />} />
            <Route path="tables/:tableId" element={<TableDetailPage />} />
            <Route path="shifts" element={<WaiterShiftsPage />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      {/* TanStack Query DevTools - only shows in development */}
      <ReactQueryDevtools
        initialIsOpen={false}
      />
    </QueryClientProvider>
  );
}

export default App;
