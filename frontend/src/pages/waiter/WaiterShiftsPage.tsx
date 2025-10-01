import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { shiftsAPI } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingOverlay } from '../../components/ui/Loading';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router';

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString();
};

const WaiterShiftsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: shifts = [], isLoading, error } = useQuery({
    queryKey: ['waiter', 'shifts'],
    queryFn: shiftsAPI.getMyShifts,
  });

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950 p-6">
      <LoadingOverlay isVisible={isLoading} text="Loading your shifts..." />
      <Button
        variant="secondary"
        onClick={() => navigate('/waiter/dashboard')}
        className="w-full sm:w-auto mb-6"
      >
        ← Back to Dashboard
      </Button>
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100 mb-6">My Shifts</h1>
        {error && <Alert variant="warning">Failed to load shifts.</Alert>}
        {shifts.length === 0 && !isLoading ? (
          <Card>
            <CardContent className="text-center py-8 text-primary-600 dark:text-primary-300">
              You have no assigned shifts.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {shifts.map(shift => (
              <Card key={shift.id}>
                <CardHeader>
                  <CardTitle>Shift #{shift.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:gap-8">
                    <div>
                      <span className="font-semibold">Start:</span> {formatDate(shift.startDate)}
                    </div>
                    <div>
                      <span className="font-semibold">End:</span> {formatDate(shift.endDate)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaiterShiftsPage;
