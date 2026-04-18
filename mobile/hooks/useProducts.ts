import { useApi } from '@/lib/api';
import type { Product } from '@/types';
import { useQuery } from '@tanstack/react-query';

const useProducts = () => {
  const api = useApi();

  const result = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<Product[]>('/products');
      return response.data;
    },
  });

  return result;
};

export const useProduct = (productId: string) => {
  const api = useApi();

  const result = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      return data;
    },
    enabled: Boolean(productId),
  });

  return result;
};

export default useProducts;
