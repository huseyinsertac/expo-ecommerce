import { useQuery } from '@tanstack/react-query';
import { useAuthenticatedApi } from '../lib/api';
import { formatDate } from '../lib/utils';

const AVATAR_PLACEHOLDER_DATA_URI =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23e5e7eb"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-family="Arial,sans-serif" font-size="12">No Image</text></svg>';

function CustomersPage() {
  const { customerApi } = useAuthenticatedApi();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['customers'],
    queryFn: customerApi.getAll,
  });

  const customers = data?.customers || [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        {!isLoading && !isError && (
          <p className="text-base-content/70 mt-1">
            {customers.length}{' '}
            {customers.length === 1 ? 'customer' : 'customers'} registered.
          </p>
        )}
      </div>
      {/* CUSTOMERS TABLE */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-error">
              <p className="text-xl font-semibold mb-2">
                Failed to load customers.
              </p>
              <p className="text-sm">{error?.message || 'Please try again.'}</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12 text-base-content/60">
              <p className="text-xl font-semibold mb-2">No customers found.</p>
              <p className="text-sm">
                Once customers start registering, they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Addresses</th>
                    <th>Wishlist</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center">
                              <img
                                src={
                                  customer.imageUrl ||
                                  AVATAR_PLACEHOLDER_DATA_URI
                                }
                                alt={customer.name}
                                className="rounded-full w-12 h-12"
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  const currentSrc = img.getAttribute('src');

                                  if (
                                    currentSrc !== AVATAR_PLACEHOLDER_DATA_URI
                                  ) {
                                    img.src = AVATAR_PLACEHOLDER_DATA_URI;
                                  } else {
                                    img.onerror = null;
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                          </div>
                        </div>
                      </td>
                      <td>{customer.email}</td>
                      <td>
                        <div className="badge badge-ghost">
                          {customer.addresses?.length || 0} address(es)
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-ghost">
                          {customer.wishlist?.length || 0} item
                          {customer.wishlist?.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td>{formatDate(customer.createdAt)}</td>
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

export default CustomersPage;
