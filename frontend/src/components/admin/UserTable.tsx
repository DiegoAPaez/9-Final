import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
  flexRender,
} from '@tanstack/react-table';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import {
  PencilIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import type { UserInfo } from '../../services/api';

interface UserTableProps {
  users: UserInfo[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  onEditUser: (user: UserInfo) => void;
  onChangePassword: (user: UserInfo) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  sorting,
  setSorting,
  globalFilter,
  setGlobalFilter,
  onEditUser,
  onChangePassword,
}) => {
  const columnHelper = createColumnHelper<UserInfo>();

  const columns: ColumnDef<UserInfo, any>[] = [
    columnHelper.accessor('username', {
      header: 'Username',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar username={row.original.username} size="sm" />
          <div className="font-medium text-primary-700 dark:text-primary-100">{row.original.username}</div>
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: ({ getValue }) => (
        <div className="text-sm text-primary-500 dark:text-primary-100">{getValue()}</div>
      ),
    }),
    columnHelper.accessor('roles', {
      header: 'Role',
      cell: ({ getValue }) => {
        const roles = getValue();
        const roleValue = Array.isArray(roles) && roles.length > 0 ? roles[0] : 'N/A';

        return (
          <Badge
            variant={
              roleValue === 'ADMIN' ? 'success' :
              roleValue === 'CASHIER' ? 'info' : 'default'
            }
          >
            {roleValue}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditUser(row.original)}
          >
            <PencilIcon className="w-4 h-4 text-primary-500 dark:text-primary-100" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChangePassword(row.original)}
          >
            <KeyIcon className="w-4 h-4 text-primary-500 dark:text-primary-100" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        setSorting(updaterOrValue);
      } else {
        setSorting(updaterOrValue);
      }
    },
    onGlobalFilterChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        setGlobalFilter(updaterOrValue);
      } else {
        setGlobalFilter(updaterOrValue);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card className="bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-600">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-primary-200 dark:border-primary-600">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-primary-500 dark:text-primary-300 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none flex items-center space-x-1'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {header.column.getCanSort() && (
                            <span className="text-primary-500 dark:text-primary-300">
                              {{
                                asc: ' ↗',
                                desc: ' ↘',
                              }[header.column.getIsSorted() as string] ?? ' ↕'}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-primary-200 dark:divide-primary-600">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-primary-50 dark:hover:bg-primary-700">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-primary-200 dark:border-primary-600">
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </Button>
          </div>
          <span className="text-sm text-primary-500 dark:text-primary-300">
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTable;
