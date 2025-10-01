import React from 'react';
import { useNavigate } from 'react-router';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const WaiterDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100 mb-6">Waiter Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tables Card */}
          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => navigate('/waiter/tables')}>
            <CardHeader>
              <CardTitle>Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-700 dark:text-primary-200 mb-2">View and manage all restaurant tables.</p>
              <Button variant="primary" onClick={() => navigate('/waiter/tables')}>Go to Tables</Button>
            </CardContent>
          </Card>

          {/* Shifts Card */}
          <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => navigate('/waiter/shifts')}>
            <CardHeader>
              <CardTitle>My Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-primary-700 dark:text-primary-200 mb-2">View your assigned shifts.</p>
              <Button variant="primary" onClick={() => navigate('/waiter/shifts')}>View Shifts</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;
