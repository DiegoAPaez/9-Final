import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftsAPI } from '../services/api';
import type { ShiftDto, CreateShiftRequest, UpdateShiftRequest, UserInfo } from '../services/api';

// Query keys for consistent caching
const QUERY_KEYS = {
  shifts: ['shifts'] as const,
  shift: (id: number) => ['shifts', id] as const,
  userShifts: (userId: number) => ['shifts', 'user', userId] as const,
};

export const useShiftManagement = (users: UserInfo[] = []) => {
  const queryClient = useQueryClient();

  // React Query for shifts data with caching
  const {
    data: shifts = [],
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.shifts,
    queryFn: shiftsAPI.getAllShifts,
    staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
    gcTime: 1000 * 60 * 30, // 30 minutes - cache retention
  });

  // Local UI state
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftDto | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateShiftRequest>({
    startDate: '',
    endDate: '',
    userId: 0,
  });
  const [editForm, setEditForm] = useState<UpdateShiftRequest>({
    startDate: '',
    endDate: '',
    userId: 0,
  });

  // Helper function to get username by ID
  const getUsernameById = (userId: number): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : `User ${userId}`;
  };

  // Mutations with optimistic updates
  const createShiftMutation = useMutation({
    mutationFn: shiftsAPI.createShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shifts });
      setCreateForm({ startDate: '', endDate: '', userId: 0 });
      setIsCreateModalOpen(false);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to create shift');
      console.error(`Failed to create shift: ${err}`);
    },
  });

  const updateShiftMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateShiftRequest }) =>
      shiftsAPI.updateShift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shifts });
      setIsEditModalOpen(false);
      setSelectedShift(null);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to update shift');
      console.error(`Failed to update shift: ${err}`);
    },
  });

  const deleteShiftMutation = useMutation({
    mutationFn: shiftsAPI.deleteShift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.shifts });
      setIsDeleteModalOpen(false);
      setSelectedShift(null);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to delete shift');
      console.error(`Failed to delete shift: ${err}`);
    },
  });

  // Handler functions
  const handleCreateShift = async (form: CreateShiftRequest) => {
    createShiftMutation.mutate(form);
  };

  const handleEditShift = (shift: ShiftDto) => {
    setSelectedShift(shift);
    setEditForm({
      startDate: shift.startDate,
      endDate: shift.endDate,
      userId: shift.userId,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateShift = async (form: UpdateShiftRequest) => {
    if (!selectedShift) return;
    updateShiftMutation.mutate({ id: selectedShift.id, data: form });
  };

  const handleDeleteShift = (shift: ShiftDto) => {
    setSelectedShift(shift);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedShift) return;
    deleteShiftMutation.mutate(selectedShift.id);
  };

  // Compute loading state from mutations
  const actionLoading =
    createShiftMutation.isPending ||
    updateShiftMutation.isPending ||
    deleteShiftMutation.isPending;

  // Handle query error
  const finalError = error || (queryError ? 'Failed to load shifts' : null);

  // Filter shifts based on search criteria with username support
  const filteredShifts = shifts.filter(shift => {
    // Search by username or user ID
    const username = getUsernameById(shift.userId).toLowerCase();
    const matchesSearch = searchTerm === '' ||
      username.includes(searchTerm.toLowerCase()) ||
      shift.userId.toString().includes(searchTerm);

    const shiftStart = new Date(shift.startDate);
    const shiftEnd = new Date(shift.endDate);

    const matchesStartDate = startDateFilter === '' ||
      shiftStart >= new Date(startDateFilter);

    const matchesEndDate = endDateFilter === '' ||
      shiftEnd <= new Date(endDateFilter);

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  return {
    // State
    shifts: filteredShifts,
    isLoading,
    error: finalError,
    setError,
    actionLoading,

    // Search/Filter state
    searchTerm,
    setSearchTerm,
    startDateFilter,
    setStartDateFilter,
    endDateFilter,
    setEndDateFilter,

    // Modal states
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedShift,

    // Form states
    createForm,
    setCreateForm,
    editForm,
    setEditForm,

    // Handlers
    handleCreateShift,
    handleEditShift,
    handleUpdateShift,
    handleDeleteShift,
    handleConfirmDelete,

    // Additional React Query utilities
    refetch, // Manual refetch if needed
  };
};
