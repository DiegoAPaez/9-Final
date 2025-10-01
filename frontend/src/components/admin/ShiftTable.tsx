import React from 'react';
import { format } from 'date-fns';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import type { ShiftDto } from '../../services/api';

interface ShiftTableProps {
  shifts: ShiftDto[];
  isLoading: boolean;
  onEditShift: (shift: ShiftDto) => void;
  onDeleteShift: (shift: ShiftDto) => void;
  users: Array<{ id: number; username: string }>;
}

const ShiftTable: React.FC<ShiftTableProps> = ({
  shifts,
  isLoading,
  onEditShift,
  onDeleteShift,
  users = []
}) => {
  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : `User ${userId}`;
  };

  const getShiftDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return `${diffHours.toFixed(1)}h`;
  };

  const getShiftStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    if (now >= start && now <= end) return { status: 'active', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    return { status: 'completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' };
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-primary-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-600">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-primary-200 dark:bg-primary-700 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-primary-100 dark:bg-primary-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (shifts.length === 0) {
    return (
      <div className="bg-white dark:bg-primary-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-600">
        <div className="p-8 text-center">
          <div className="text-primary-400 dark:text-primary-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-primary-700 dark:text-primary-200 mb-2">
            No shifts found
          </h3>
          <p className="text-primary-500 dark:text-primary-400">
            No shifts match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-primary-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-600 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-primary-200 dark:divide-primary-600">
          <thead className="bg-primary-50 dark:bg-primary-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Start Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                End Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-primary-800 divide-y divide-primary-200 dark:divide-primary-600">
            {shifts.map((shift) => {
              const shiftStatus = getShiftStatus(shift.startDate, shift.endDate);

              return (
                <tr key={shift.id} className="hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary-900 dark:text-primary-100">
                      {getUserName(shift.userId)}
                    </div>
                    <div className="text-sm text-primary-500 dark:text-primary-400">
                      ID: {shift.userId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary-900 dark:text-primary-100">
                      {format(new Date(shift.startDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-primary-500 dark:text-primary-400">
                      {format(new Date(shift.startDate), 'HH:mm')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary-900 dark:text-primary-100">
                      {format(new Date(shift.endDate), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-primary-500 dark:text-primary-400">
                      {format(new Date(shift.endDate), 'HH:mm')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">
                    {getShiftDuration(shift.startDate, shift.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`${shiftStatus.color} capitalize`}>
                      {shiftStatus.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEditShift(shift)}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDeleteShift(shift)}
                        className="text-red-600 hover:text-white hover:bg-error-600 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftTable;
