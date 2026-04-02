import { useAuthenticatedApi } from '../lib/api';
import { formatDate } from '../lib/utils';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function OrdersPage() {
  const queryClient = useQueryClient();
  const { orderApi } = useAuthenticatedApi();

  const {
    data: ordersData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getAll,
  });

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const orders = ordersData?.orders || [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-base-content/70">
          Manage and track all customer orders from this dashboard.
        </p>
      </div>
      {/* ORDERS TABLE */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-error">
              <p className="text-xl font-semibold mb-2">
                Failed to load orders.
              </p>
              <p className="text-sm">{error?.message || 'Please try again.'}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">No orders found.</p>
              <p className="text-sm">
                Once customers start placing orders, they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const orderItems = Array.isArray(order.orderItems)
                      ? order.orderItems
                      : [];
                    const totalQuantity = orderItems.reduce((sum, item) => {
                      const normalizedQuantity = Number(item?.quantity);
                      return (
                        sum +
                        (Number.isFinite(normalizedQuantity)
                          ? normalizedQuantity
                          : 0)
                      );
                    }, 0);
                    const orderTotal = Number(order.totalPrice ?? 0);
                    return (
                      <tr key={order._id}>
                        <td>
                          <span className="font-medium">
                            {order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <div className="font-medium">
                            {order.shippingAddress?.fullName || 'N/A'}
                          </div>
                          <div className="text-sm opacity-60">
                            {order.shippingAddress?.city || 'N/A'},{' '}
                            {order.shippingAddress?.state || 'N/A'}
                          </div>
                        </td>

                        <td>
                          <div className="font-medium">
                            {totalQuantity} item{totalQuantity > 1 ? 's' : ''}
                          </div>
                          <div className="text-sm opacity-60">
                            {orderItems[0]?.name || 'No item details'}
                            {orderItems.length > 1 &&
                              ` +${orderItems.length - 1} more`}
                          </div>
                        </td>

                        <td>
                          <span className="font-semibold">
                            $
                            {Number.isFinite(orderTotal)
                              ? orderTotal.toFixed(2)
                              : '0.00'}
                          </span>
                        </td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="select select-sm"
                            disabled={updateStatusMutation.isPending}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <span className="text-sm opacity-60">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
