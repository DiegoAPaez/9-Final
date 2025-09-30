import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/api';
import type { UserInfo, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from '../services/api';

// Query keys for consistent caching
const QUERY_KEYS = {
  users: ['users'] as const,
  user: (id: number) => ['users', id] as const,
};

export const useUserManagement = () => {
  const queryClient = useQueryClient();

  // React Query for users data with caching
  const {
    data: users = [],
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: userAPI.getUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
    gcTime: 1000 * 60 * 30, // 30 minutes - cache retention
  });

  // Local UI state
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    username: '',
    email: '',
    password: '',
    role: 'WAITER',
  });
  const [editForm, setEditForm] = useState<UpdateUserRequest>({
    username: '',
    email: '',
    role: 'WAITER',
  });
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Mutations with optimistic updates
  const createUserMutation = useMutation({
    mutationFn: userAPI.createUser,
    onSuccess: () => {
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      setCreateForm({ username: '', email: '', password: '', role: 'WAITER' });
      setIsCreateModalOpen(false);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to create user');
      console.error(`Failed to create user: ${err}`);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      userAPI.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to update user');
      console.error(`Failed to update user: ${err}`);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChangePasswordRequest }) =>
      userAPI.changeUserPassword(id, data),
    onSuccess: () => {
      setIsPasswordModalOpen(false);
      setSelectedUser(null);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setError(null);
    },
    onError: (err) => {
      setError('Failed to change password');
      console.error(`Failed to change password: ${err}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userAPI.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to delete user');
      console.error(`Failed to delete user: ${err}`);
    },
  });

  // Handler functions
  const handleCreateUser = async (form: CreateUserRequest) => {
    createUserMutation.mutate(form);
  };

  const handleEditUser = (user: UserInfo) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      role: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0] : 'WAITER',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (form: UpdateUserRequest) => {
    if (!selectedUser) return;
    updateUserMutation.mutate({ id: selectedUser.id, data: form });
  };

  const handleChangePassword = (user: UserInfo) => {
    setSelectedUser(user);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setIsPasswordModalOpen(true);
  };

  const handleUpdatePassword = async (form: ChangePasswordRequest) => {
    if (!selectedUser) return;
    changePasswordMutation.mutate({ id: selectedUser.id, data: form });
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id);
  };

  // Compute loading state from mutations
  const actionLoading =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    changePasswordMutation.isPending ||
    deleteUserMutation.isPending;

  // Handle query error
  const finalError = error || (queryError ? 'Failed to load users' : null);

  return {
    // State
    users,
    isLoading,
    error: finalError,
    setError,
    actionLoading,

    // Modal states
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,

    // Form states
    createForm,
    setCreateForm,
    editForm,
    setEditForm,
    passwordForm,
    setPasswordForm,
    showPassword,
    setShowPassword,

    // Handlers
    handleCreateUser,
    handleEditUser,
    handleUpdateUser,
    handleChangePassword,
    handleUpdatePassword,
    handleConfirmDelete,

    // Additional React Query utilities
    refetch, // Manual refetch if needed
  };
};
