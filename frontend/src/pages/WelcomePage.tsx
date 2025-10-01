import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import LoginForm from '../components/forms/LoginForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { LoadingOverlay } from '../components/ui/Loading';
import { authAPI, type LoginRequest } from '../services/api';
import axios from 'axios';

const WelcomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (data: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authAPI.login(data);
      const userInfo = await authAPI.getCurrentUser();

      if (userInfo.roles.includes('ADMIN')) {
        navigate('/admin/dashboard');
      } else if (userInfo.roles.includes('CASHIER')) {
        navigate('/cashier/dashboard');
      } else if (userInfo.roles.includes('WAITER')) {
        navigate('/waiter/dashboard');
      } else {
        throw new Error('No valid role found for user');
      }

    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred';

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (status === 403) {
          errorMessage = 'Access denied';
        } else if (status && status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-100 dark:bg-primary-900 flex items-center justify-center p-4">
      <LoadingOverlay isVisible={isLoading} text="Signing you in..." />

      <div className="w-full max-w-md space-y-6">
        {/* Restaurant Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-200">
            Restaurant Management
          </h1>
          <p className="text-primary-500 dark:text-primary-300">
            Staff Management System
          </p>
        </div>

        <Card className="shadow-lg bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600">
          <CardHeader className="text-center">
            <CardTitle className="text-primary-700 dark:text-primary-100">Welcome Back</CardTitle>
            <CardDescription className="text-primary-500 dark:text-primary-300">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>

        <div className="text-center text-sm text-primary-500 dark:text-primary-300">
          <p>© 2025 Restaurant Management System</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
