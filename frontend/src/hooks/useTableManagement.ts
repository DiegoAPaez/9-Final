import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tablesAPI } from '../services/api';
import type { RestaurantTableDto, CreateRestaurantTableRequest, UpdateRestaurantTableRequest } from '../services/api';
import type { TableStateEnum } from '../utils/tableValidation';

// Query keys for consistent caching
const QUERY_KEYS = {
  tables: ['tables'] as const,
  table: (id: number) => ['tables', id] as const,
  tableByNumber: (number: number) => ['tables', 'number', number] as const,
  tablesByState: (state: TableStateEnum) => ['tables', 'state', state] as const,
};

export const useTableManagement = () => {
  const queryClient = useQueryClient();

  // React Query for tables data with caching
  const {
    data: tables = [],
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.tables,
    queryFn: tablesAPI.getAllTables,
    staleTime: 1000 * 60 * 2, // 2 minutes - tables change more frequently
    gcTime: 1000 * 60 * 10, // 10 minutes - cache retention
  });

  // Local UI state
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<RestaurantTableDto | null>(null);

  // Mutations with optimistic updates
  const createTableMutation = useMutation({
    mutationFn: tablesAPI.createTable,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables });
      setIsCreateModalOpen(false);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to create table');
      console.error(`Failed to create table: ${err}`);
    },
  });

  const updateTableMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRestaurantTableRequest }) =>
      tablesAPI.updateTable(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables });
      setIsEditModalOpen(false);
      setSelectedTable(null);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to update table');
      console.error(`Failed to update table: ${err}`);
    },
  });

  const updateTableStateMutation = useMutation({
    mutationFn: ({ id, state }: { id: number; state: TableStateEnum }) =>
      tablesAPI.updateTableState(id, state),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables });
      setError(null);
    },
    onError: (err) => {
      setError('Failed to update table state');
      console.error(`Failed to update table state: ${err}`);
    },
  });

  const deleteTableMutation = useMutation({
    mutationFn: tablesAPI.deleteTable,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tables });
      setIsDeleteModalOpen(false);
      setSelectedTable(null);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to delete table');
      console.error(`Failed to delete table: ${err}`);
    },
  });

  // Handler functions
  const handleCreateTable = async (form: CreateRestaurantTableRequest) => {
    createTableMutation.mutate(form);
  };

  const handleEditTable = (table: RestaurantTableDto) => {
    setSelectedTable(table);
    setIsEditModalOpen(true);
  };

  const handleUpdateTable = async (form: UpdateRestaurantTableRequest) => {
    if (!selectedTable) return;
    updateTableMutation.mutate({ id: selectedTable.id, data: form });
  };

  const handleUpdateTableState = async (tableId: number, state: TableStateEnum) => {
    updateTableStateMutation.mutate({ id: tableId, state });
  };

  const handleDeleteTable = (table: RestaurantTableDto) => {
    setSelectedTable(table);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTable) return;
    deleteTableMutation.mutate(selectedTable.id);
  };

  // Compute loading state from mutations
  const actionLoading =
    createTableMutation.isPending ||
    updateTableMutation.isPending ||
    updateTableStateMutation.isPending ||
    deleteTableMutation.isPending;

  // Handle query error
  const finalError = error || (queryError ? 'Failed to load tables' : null);

  // Filter tables based on search criteria
  const filteredTables = tables.filter(table => {
    // Search by table number
    const matchesSearch = searchTerm === '' ||
      table.number.toString().includes(searchTerm);

    // Filter by state
    const matchesState = stateFilter === '' ||
      table.tableState === stateFilter;

    return matchesSearch && matchesState;
  });

  return {
    // State
    tables: filteredTables,
    isLoading,
    error: finalError,
    setError,
    actionLoading,

    // Search/Filter state
    searchTerm,
    setSearchTerm,
    stateFilter,
    setStateFilter,

    // Modal states
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedTable,

    // Handlers
    handleCreateTable,
    handleEditTable,
    handleUpdateTable,
    handleUpdateTableState,
    handleDeleteTable,
    handleConfirmDelete,

    // Additional React Query utilities
    refetch, // Manual refetch if needed
  };
};
