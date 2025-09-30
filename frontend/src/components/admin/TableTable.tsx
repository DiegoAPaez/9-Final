import React from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatTableStateName, getTableStateColor, type TableStateEnum } from '../../utils/tableValidation';
import type { RestaurantTableDto } from "../../services/api";


interface TableTableProps {
  tables: RestaurantTableDto[];
  isLoading: boolean;
  onEditTable: (table: RestaurantTableDto) => void;
  onDeleteTable: (table: RestaurantTableDto) => void;
  onUpdateTableState: (tableId: number, state: TableStateEnum) => void;
}

const TableTable: React.FC<TableTableProps> = ({
  tables,
  isLoading,
  onEditTable,
  onDeleteTable,
  onUpdateTableState
}) => {
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

  if (tables.length === 0) {
    return (
      <div className="bg-white dark:bg-primary-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-600">
        <div className="p-8 text-center">
          <div className="text-primary-400 dark:text-primary-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-primary-700 dark:text-primary-200 mb-2">
            No tables found
          </h3>
          <p className="text-primary-500 dark:text-primary-400">
            No tables match your current filters. Try adjusting your search criteria.
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
                Table #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Current Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Quick Status Change
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-primary-800 divide-y divide-primary-200 dark:divide-primary-600">
            {tables.map((table) => (
              <tr key={table.id} className="hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-primary-900 dark:text-primary-100">
                    Table {table.number}
                  </div>
                  <div className="text-sm text-primary-500 dark:text-primary-400">
                    ID: {table.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getTableStateColor(table.tableState)}>
                    {formatTableStateName(table.tableState)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-primary-900 dark:text-primary-100">
                    {table.currentOrderId ? `Order #${table.currentOrderId}` : 'No active order'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {table.tableState !== 'AVAILABLE' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onUpdateTableState(table.id, 'AVAILABLE')}
                        className="text-xs bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-200"
                      >
                        Available
                      </Button>
                    )}
                    {table.tableState !== 'OCCUPIED' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onUpdateTableState(table.id, 'OCCUPIED')}
                        className="text-xs bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-200"
                      >
                        Occupied
                      </Button>
                    )}
                    {table.tableState !== 'RESERVED' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onUpdateTableState(table.id, 'RESERVED')}
                        className="text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200"
                      >
                        Reserved
                      </Button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEditTable(table)}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onDeleteTable(table)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableTable;
