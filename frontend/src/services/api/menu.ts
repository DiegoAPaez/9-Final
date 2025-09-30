import type { CategoryEnum } from "../../utils/menuValidation";
import api from './base';

export interface MenuItemDto {
  id: number;
  name: string;
  description: string;
  allergens: number[]; // from string
  price: number;
  category: CategoryEnum;
}

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  allergens: number[]; // from string
  price: number;
  category: CategoryEnum;
}

export interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  allergens?: number[]; // from string
  price?: number;
  category?: CategoryEnum;
}

export const menuAPI = {
  // Admin Menu Management
  getAllMenuItems: async (): Promise<MenuItemDto[]> => {
    const response = await api.get('/api/admin/menu-items');
    return response.data;
  },

  getMenuItemById: async (id: number): Promise<MenuItemDto> => {
    const response = await api.get(`/api/admin/menu-items/${id}`);
    return response.data;
  },

  getMenuItemsByCategory: async (category: string): Promise<MenuItemDto[]> => {
    const response = await api.get(`/api/admin/menu-items/category/${category}`);
    return response.data;
  },

  createMenuItem: async (menuItemData: CreateMenuItemRequest): Promise<MenuItemDto> => {
    const response = await api.post('/api/admin/menu-items', menuItemData);
    return response.data;
  },

  updateMenuItem: async (id: number, menuItemData: UpdateMenuItemRequest): Promise<MenuItemDto> => {
    const response = await api.put(`/api/admin/menu-items/${id}`, menuItemData);
    return response.data;
  },

  deleteMenuItem: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/menu-items/${id}`);
  },

  // Public Menu Access
  getPublicMenuItems: async (): Promise<MenuItemDto[]> => {
    const response = await api.get('/api/menu-items');
    return response.data;
  },

  getPublicMenuItemById: async (id: number): Promise<MenuItemDto> => {
    const response = await api.get(`/api/menu-items/${id}`);
    return response.data;
  },

  getPublicMenuItemsByCategory: async (category: string): Promise<MenuItemDto[]> => {
    const response = await api.get(`/api/menu-items/category/${category}`);
    return response.data;
  },
};
