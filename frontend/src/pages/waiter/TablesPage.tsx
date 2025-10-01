import React from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { waiterAPI } from '../../services/api/waiter';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingOverlay } from '../../components/ui/Loading';
import Button from '../../components/ui/Button';

const TABLE_STATE_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
  OCCUPIED: 'bg-red-100 text-red-800 border-red-200',
  RESERVED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  OUT_OF_SERVICE: 'bg-gray-100 text-gray-800 border-gray-200',
};

const TablesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: tables = [], isLoading, error } = useQuery({
    queryKey: ['waiter', 'tables'],
    queryFn: waiterAPI.getTables,
  });

  // Sort tables by number
  const sortedTables = React.useMemo(() =>
    [...tables].sort((a, b) => a.number - b.number),
    [tables]
  );

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950 p-6">
      <LoadingOverlay isVisible={isLoading} text="Loading tables..." />
      <Button
        variant="secondary"
        onClick={() => navigate('/waiter/dashboard')}
        className="w-full sm:w-auto mb-6"
      >
        ← Back to Dashboard
      </Button>
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100 mb-6">Tables</h1>
        {error && <Alert variant="warning">Failed to load tables.</Alert>}
        <Card>
          <CardHeader>
            <CardTitle>All Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {sortedTables.map(table => (
                <div
                  key={table.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${TABLE_STATE_COLORS[table.tableState]}`}
                  onClick={() => navigate(`/waiter/tables/${table.id}`)}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{table.number}</div>
                    <div className="text-xs font-medium mb-2">{table.tableState.replace('_', ' ')}</div>
                    {table.currentOrderId && (
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Order #{table.currentOrderId}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TablesPage;
