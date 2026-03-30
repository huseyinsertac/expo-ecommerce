import axiosInstance from './axios';
import { useAuth } from '@clerk/clerk-react';

// Custom hook for authenticated API calls
export const useAuthenticatedApi = () => {
  const { getToken } = useAuth();

  const makeAuthenticatedRequest = async (method, url, data = null) => {
    const token = await getToken();
    const config = {
      method,
      url,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };

    if (data && (method === 'post' || method === 'put' || method === 'patch')) {
      config.data = data;
    }

    const response = await axiosInstance(config);
    return response.data;
  };

  return {
    productApi: {
      getAll: () => makeAuthenticatedRequest('get', '/admin/products'),
      create: (formData) =>
        makeAuthenticatedRequest('post', '/admin/products', formData),
      update: ({ id, formData }) =>
        makeAuthenticatedRequest('put', `/admin/products/${id}`, formData),
      delete: (id) =>
        makeAuthenticatedRequest('delete', `/admin/products/${id}`),
    },
    orderApi: {
      getAll: () => makeAuthenticatedRequest('get', '/admin/orders'),
      updateStatus: ({ orderId, status }) =>
        makeAuthenticatedRequest('patch', `/admin/orders/${orderId}/status`, {
          status,
        }),
    },
    customerApi: {
      getAll: () => makeAuthenticatedRequest('get', '/admin/customers'),
    },
    statsApi: {
      getDashboard: () => makeAuthenticatedRequest('get', '/admin/stats'),
    },
  };
};

// For backward compatibility, keep the old exports but they'll throw errors
export const productApi = {
  getAll: async () => {
    throw new Error('Use useAuthenticatedApi hook instead');
  },
};

export const orderApi = {
  getAll: async () => {
    throw new Error('Use useAuthenticatedApi hook instead');
  },
};

export const customerApi = {
  getAll: async () => {
    throw new Error('Use useAuthenticatedApi hook instead');
  },
};

export const statsApi = {
  getDashboard: async () => {
    throw new Error('Use useAuthenticatedApi hook instead');
  },
};
