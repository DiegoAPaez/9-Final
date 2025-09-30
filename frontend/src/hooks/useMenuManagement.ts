import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuAPI } from '../services/api';
import type { MenuItemDto, CreateMenuItemRequest, UpdateMenuItemRequest } from '../services/api';

// Query keys for consistent caching
const QUERY_KEYS = {
  menuItems: ['menu-items'] as const,
  menuItem: (id: number) => ['menu-items', id] as const,
  categoryItems: (category: string) => ['menu-items', 'category', category] as const,
};

export const useMenuManagement = () => {
  const queryClient = useQueryClient();

  // React Query for menu items data with caching
  const {
    data: menuItems = [],
    isLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.menuItems,
    queryFn: menuAPI.getAllMenuItems,
    staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
    gcTime: 1000 * 60 * 30, // 30 minutes - cache retention
  });

  // Local UI state
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemDto | null>(null);

  // Mutations with optimistic updates
  const createMenuItemMutation = useMutation({
    mutationFn: menuAPI.createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menuItems });
      setIsCreateModalOpen(false);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to create menu item');
      console.error(`Failed to create menu item: ${err}`);
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMenuItemRequest }) =>
      menuAPI.updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menuItems });
      setIsEditModalOpen(false);
      setSelectedMenuItem(null);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to update menu item');
      console.error(`Failed to update menu item: ${err}`);
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: menuAPI.deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.menuItems });
      setIsDeleteModalOpen(false);
      setSelectedMenuItem(null);
      setError(null);
    },
    onError: (err) => {
      setError('Failed to delete menu item');
      console.error(`Failed to delete menu item: ${err}`);
    },
  });

  // Handler functions
  const handleCreateMenuItem = async (form: CreateMenuItemRequest) => {
    createMenuItemMutation.mutate(form);
  };

  const handleEditMenuItem = (menuItem: MenuItemDto) => {
    setSelectedMenuItem(menuItem);
    setIsEditModalOpen(true);
  };

  const handleUpdateMenuItem = async (form: UpdateMenuItemRequest) => {
    if (!selectedMenuItem) return;
    updateMenuItemMutation.mutate({ id: selectedMenuItem.id, data: form });
  };

  const handleDeleteMenuItem = (menuItem: MenuItemDto) => {
    setSelectedMenuItem(menuItem);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMenuItem) return;
    deleteMenuItemMutation.mutate(selectedMenuItem.id);
  };

  // Compute loading state from mutations
  const actionLoading =
    createMenuItemMutation.isPending ||
    updateMenuItemMutation.isPending ||
    deleteMenuItemMutation.isPending;

  // Handle query error
  const finalError = error || (queryError ? 'Failed to load menu items' : null);

  // Filter menu items based on search criteria
  const filteredMenuItems = menuItems.filter(item => {
    // Search by name or description
    const matchesSearch = searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory = categoryFilter === '' ||
      item.category === categoryFilter;

    // Filter by price range
    const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = item.price >= minPriceNum && item.price <= maxPriceNum;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return {
    // State
    menuItems: filteredMenuItems,
    isLoading,
    error: finalError,
    setError,
    actionLoading,

    // Search/Filter state
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,

    // Modal states
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedMenuItem,

    // Handlers
    handleCreateMenuItem,
    handleEditMenuItem,
    handleUpdateMenuItem,
    handleDeleteMenuItem,
    handleConfirmDelete,

    // Additional React Query utilities
    refetch, // Manual refetch if needed
  };
};
