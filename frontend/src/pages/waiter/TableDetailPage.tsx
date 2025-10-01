import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { waiterAPI } from '../../services/api/waiter';
import { type MenuItemDto, orderItemsAPI } from '../../services/api';
import { authAPI, menuAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { LoadingOverlay } from '../../components/ui/Loading';
import MenuWithTabs from '../../components/waiter/MenuWithTabs';

interface PendingOrderItem {
  menuItem: MenuItemDto;
  quantity: number;
}

const TableDetailPage: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [customerCount, setCustomerCount] = useState<number>(1);
  const [pendingItems, setPendingItems] = useState<PendingOrderItem[]>([]);

  const { data: table, isLoading: tableLoading } = useQuery({
    queryKey: ['waiter', 'table', tableId],
    queryFn: () => waiterAPI.getTableById(Number(tableId)),
    enabled: !!tableId,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['waiter', 'orders', tableId],
    queryFn: () => waiterAPI.getOrdersByTable(Number(tableId)),
    enabled: !!tableId,
  });
  const currentOrder = orders.find(o => o.orderState !== 'COMPLETED' && o.orderState !== 'CANCELLED');

  const { data: orderItems = [], refetch: refetchOrderItems } = useQuery({
    queryKey: ['waiter', 'orderItems', currentOrder?.id],
    queryFn: () => currentOrder ? orderItemsAPI.getOrderItemsByOrder(currentOrder.id) : [],
    enabled: !!currentOrder,
  });

  const { data: currentUser } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authAPI.getCurrentUser,
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!table || !currentUser) return;
      return waiterAPI.createOrder({
        tableId: table.id,
        userId: currentUser.id,
        orderState: 'PENDING',
        customerCount,
      });
    },
    onSuccess: () => {
      setIsCreatingOrder(false);
      setCustomerCount(1);
      void queryClient.invalidateQueries({ queryKey: ['waiter', 'orders', tableId] });
    },
    onError: () => setError('Failed to create order'),
  });

  // Add all pending items to the order in one go
  const sendOrderItemsMutation = useMutation({
    mutationFn: async () => {
      if (!currentOrder) return;
      for (const pending of pendingItems) {
        await orderItemsAPI.addItemToOrder(currentOrder.id, {
          menuItemId: pending.menuItem.id,
          quantity: pending.quantity,
          unitPrice: pending.menuItem.price,
        });
      }
    },
    onSuccess: () => {
      setPendingItems([]);
      void refetchOrderItems();
      void queryClient.invalidateQueries({ queryKey: ['waiter', 'orders', tableId] });
    },
    onError: () => setError('Failed to send order items'),
  });

  // Add item to pending list
  const handleAddItem = (item: MenuItemDto, quantity: number) => {
    setPendingItems(prev => {
      const existing = prev.find(p => p.menuItem.id === item.id);
      if (existing) {
        return prev.map(p =>
          p.menuItem.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      return [...prev, { menuItem: item, quantity }];
    });
  };

  // Remove item from pending list
  const handleRemovePendingItem = (menuItemId: number) => {
    setPendingItems(prev => prev.filter(p => p.menuItem.id !== menuItemId));
  };

  // Change quantity in pending list
  const handleChangePendingQuantity = (menuItemId: number, quantity: number) => {
    setPendingItems(prev =>
      prev.map(p =>
        p.menuItem.id === menuItemId ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    );
  };

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => orderItemsAPI.deleteOrderItem(itemId),
    onSuccess: () => refetchOrderItems(),
    onError: () => setError('Failed to remove item'),
  });

  const { data: allMenuItems = [] } = useQuery({
    queryKey: ['waiter', 'allMenuItems'],
    queryFn: menuAPI.getPublicMenuItems,
  });

  if (tableLoading) {
    return <LoadingOverlay isVisible={true} text="Loading table details..." />;
  }
  if (!table) {
    return (
      <div className="min-h-screen bg-primary-50 dark:bg-primary-950 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert variant="warning">Table not found</Alert>
          <Button variant="secondary" onClick={() => navigate('/waiter/tables')} className="mt-4">← Back to Tables</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-950 p-6">
      <LoadingOverlay isVisible={createOrderMutation.isPending || sendOrderItemsMutation.isPending} text="Processing..." />
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-100">Table {table.number}</h1>
            <p className="text-primary-600 dark:text-primary-300 mt-1">Manage orders and add items</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/waiter/tables')}>← Back to Tables</Button>
        </div>
        {error && <Alert variant="warning" onDismiss={() => setError(null)}>{error}</Alert>}
        <Card>
          <CardHeader>
            <CardTitle>Table Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:gap-8">
              <div>
                <div className="mb-2"><span className="font-semibold">Number:</span> {table.number}</div>
                <div className="mb-2"><span className="font-semibold">State:</span> {table.tableState.replace('_', ' ')}</div>
                {table.currentOrderId && <div className="mb-2"><span className="font-semibold">Current Order ID:</span> {table.currentOrderId}</div>}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Order Section */}
        {!currentOrder && !isCreatingOrder && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="mb-4 text-primary-600 dark:text-primary-400">No active order for this table.</p>
              <Button variant="primary" onClick={() => setIsCreatingOrder(true)}>Start New Order</Button>
            </CardContent>
          </Card>
        )}
        {isCreatingOrder && (
          <Card>
            <CardHeader><CardTitle>Start New Order</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">Customer Count</label>
                <input
                  type="number"
                  min={1}
                  value={customerCount}
                  onChange={e => setCustomerCount(Number(e.target.value))}
                  className="w-24 px-2 py-1 border rounded"
                />
              </div>
              <Button variant="primary" onClick={() => createOrderMutation.mutate()} disabled={createOrderMutation.isPending}>Create Order</Button>
              <Button variant="secondary" onClick={() => setIsCreatingOrder(false)} className="ml-2">Cancel</Button>
            </CardContent>
          </Card>
        )}
        {currentOrder && (
          <>
            <Card>
              <CardHeader><CardTitle>Current Order</CardTitle></CardHeader>
              <CardContent>
                <div className="mb-2"><span className="font-semibold">Order ID:</span> {currentOrder.id}</div>
                <div className="mb-2"><span className="font-semibold">State:</span> {currentOrder.orderState}</div>
                <div className="mb-2"><span className="font-semibold">Customer Count:</span> {currentOrder.customerCount}</div>
                <div className="mb-2"><span className="font-semibold">Total Amount:</span> ${currentOrder.totalAmount}</div>
                {/* Show pending items if any, otherwise show backend items */}
                {pendingItems.length > 0 ? (
                  <div className="mt-4">
                    <h2 className="font-semibold mb-2">Pending Items (not sent)</h2>
                    <div className="space-y-2">
                      {pendingItems.map(pending => (
                        <div key={pending.menuItem.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <span className="font-medium">{pending.menuItem.name}</span>
                            <span className="text-sm text-primary-600 ml-2">Qty: </span>
                            <input
                              type="number"
                              min={1}
                              value={pending.quantity}
                              onChange={e => handleChangePendingQuantity(pending.menuItem.id, Number(e.target.value))}
                              className="w-16 px-1 py-0.5 border rounded ml-1"
                            />
                            <span className="text-sm text-primary-600 ml-2">Unit: ${pending.menuItem.price}</span>
                          </div>
                          <Button variant="danger" size="sm" onClick={() => handleRemovePendingItem(pending.menuItem.id)}>Remove</Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="primary"
                      className="mt-4"
                      onClick={() => sendOrderItemsMutation.mutate()}
                      disabled={sendOrderItemsMutation.isPending}
                    >
                      Send Order
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <h2 className="font-semibold mb-2">Order Items</h2>
                    {orderItems.length === 0 ? (
                      <div className="text-primary-600 dark:text-primary-400">No items in this order.</div>
                    ) : !allMenuItems.length ? (
                      <div className="text-primary-600 dark:text-primary-400">Loading menu items...</div>
                    ) : (
                      <div className="space-y-2">
                        {orderItems.map(item => {
                          const menuItem = allMenuItems.find(mi => mi.id === item.menuItemId);
                          return (
                            <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <span className="font-medium">
                                  {menuItem ? menuItem.name : <span className="text-red-600">Menu item not found (id: {item.menuItemId})</span>}
                                </span>
                                <span className="text-sm text-primary-600 ml-2">Qty: {item.quantity}</span>
                                <span className="text-sm text-primary-600 ml-2">Unit: ${item.unitPrice}</span>
                              </div>
                              <Button variant="danger" size="sm" onClick={() => removeItemMutation.mutate(item.id)} disabled={removeItemMutation.isPending}>Remove</Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <MenuWithTabs onAddItem={handleAddItem} />
          </>
        )}
      </div>
    </div>
  );
};

export default TableDetailPage;
