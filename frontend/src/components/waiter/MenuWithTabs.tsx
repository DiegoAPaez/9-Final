import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { menuAPI } from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Alert } from '../ui/Alert';
import type { MenuItemDto } from '../../services/api';

interface MenuWithTabsProps {
  onAddItem: (item: MenuItemDto, quantity: number) => void;
}

const MenuWithTabs: React.FC<MenuWithTabsProps> = ({ onAddItem }) => {
  const { data: menuItems = [], error } = useQuery({
    queryKey: ['menu', 'items'],
    queryFn: menuAPI.getPublicMenuItems,
  });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((item: MenuItemDto) => item.category)));
    return ['ALL', ...cats];
  }, [menuItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item: MenuItemDto) => {
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="warning">Failed to load menu.</Alert>}
        <div className="mb-4 flex flex-col md:gap-4">
          <div className="flex gap-2 mb-2 md:mb-0 overflow-x-auto">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <Input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredItems.length === 0 && (
            <div className="text-primary-600 dark:text-primary-300 text-center py-4">No items found.</div>
          )}
          {filteredItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-primary-600 ml-2">${item.price}</span>
                <span className="text-xs ml-2 text-primary-400">{item.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={quantities[item.id] || ''}
                  onChange={e => setQuantities(q => ({ ...q, [item.id]: Number(e.target.value) }))}
                  className="w-16"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (quantities[item.id] > 0) {
                      onAddItem(item, quantities[item.id]);
                      setQuantities(q => ({ ...q, [item.id]: 0 }));
                    }
                  }}
                  disabled={!quantities[item.id] || quantities[item.id] <= 0}
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuWithTabs;
