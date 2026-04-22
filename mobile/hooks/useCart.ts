import { useApi } from '@/lib/api';
import { Cart } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get<Cart>('/cart');
      return data ?? null;
    },
  });

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

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const { data } = await api.put<{ cart: Cart }>(`/cart/${productId}`, {
        quantity,
      });
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ cart: Cart }>(`/cart/${productId}`);
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ cart: Cart }>('/cart');
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const cartTotal =
    cart?.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    ) ?? 0;

  const cartItemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutateAsync,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};

export default useCart;
