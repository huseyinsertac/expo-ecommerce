import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedApi } from '../lib/api';
import {
  DollarSignIcon,
  ShoppingBag,
  UsersIcon,
  PackageIcon,
} from 'lucide-react';
import { formatDate } from '../lib/utils';

const getOrderStatusBadge = (status) => {
  const statusMap = {
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success',
    cancelled: 'badge-error',
  };
  return statusMap[status] || 'badge-neutral';
};

function DashboardPage() {
  const { orderApi, statsApi } = useAuthenticatedApi();

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getAll,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: statsApi.getDashboard,
  });

  //it would be better to send the last 5 itmes from api then slicing but fwe are just keeping it simple for now.
  // const recentOrders = ordersData?.orders?.slice(0, 5) || [];

  const statsCards = [
    {
      title: 'Total Revenue',
      value: statsLoading
        ? 'Loading...'
        : statsError
          ? 'Error'
          : `$${statsData?.totalRevenue?.toFixed(2) || 0}`,
      icon: <DollarSignIcon className="size-8" />,
    },
    {
      title: 'Total Orders',
      value: statsLoading
        ? 'Loading...'
        : statsError
          ? 'Error'
          : statsData?.totalOrders,
      icon: <ShoppingBag className="size-8" />,
    },
    {
      title: 'Total Customers',
      value: statsLoading
        ? 'Loading...'
        : statsError
          ? 'Error'
          : statsData?.totalCustomers,
      icon: <UsersIcon className="size-8" />,
    },
    {
      title: 'Total Products',
      value: statsLoading
        ? 'Loading...'
        : statsError
          ? 'Error'
          : statsData?.totalProducts,
      icon: <PackageIcon className="size-8" />,
    },
  ];

  //console.log('DashboardPage - isLoading:', statsLoading);

  //console.log('DashboardPage - ordersData:', ordersData);

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error || statsError) {
    return <div>Error: {error?.message || statsError?.message}</div>;
  }
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
        {statsCards.map((stat) => (
          <div key={stat.title} className="stat">
            <div className="stat-figure text-primary">{stat.icon}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
      {/* Recent Orders */}
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Orders</h2>

          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : ordersData?.orders?.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              No recent orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData?.orders?.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="font-medium">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium">
                            {order.shippingAddress.fullName}
                          </div>
                          <div className="text-sm opacity-60">
                            {order.orderItems.length} item(s)
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          {order.orderItems[0]?.name}
                          {order.orderItems.length > 1 &&
                            ` +${order.orderItems.length - 1} more`}
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold">
                          ${order.totalPrice.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <div
                          className={`badge ${getOrderStatusBadge(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </div>
                      </td>
                      <td>
                        <span className="text-sm opacity-60">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
