import { useApi } from '@/lib/api';
import type { Cart } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AddToCartPayload = {
  productId: string;
  quantity?: number;
};

type AddToCartResponse = {
  message: string;
  cart: Cart;
};

const useCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: AddToCartPayload) => {
      const { data } = await api.post<AddToCartResponse>('/cart', {
        productId,
        quantity,
      });
      return data.cart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    isAddingToCart: addToCartMutation.isPending,
    addToCart: addToCartMutation.mutate,
  };
};

export default useCart;
