import useCart from '@/hooks/useCart';
import useWishlist from '@/hooks/useWishlist';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  type GestureResponderEvent,
} from 'react-native';

interface ProductsGridProps {
  products: Product[]; // Replace with your Product type
  isLoading: boolean;
  isError: boolean;
}

const ProductsGrid = ({ products, isLoading, isError }: ProductsGridProps) => {
  const {
    isInWishlist,
    toggleWishList,
    isAddingToWishlist,
    isRemovingFromWishlist,
  } = useWishlist();
  const { isAddingToCart, addToCart } = useCart(); // Implement useCart hook for cart functionality
  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert('Success', `${productName} added to cart!`);
        },
        onError: (error: any) => {
          Alert.alert(
            'Error',
            error.response?.data?.error ||
              error.response?.data?.message ||
              error.message ||
              'Failed to add to cart. Please try again.'
          );
        },
      }
    );
  };

  const handleToggleWishlist = (
    event: GestureResponderEvent,
    productId: string
  ) => {
    event.stopPropagation();
    toggleWishList(productId);
  };

  const renderProduct = ({ item: product }: { item: Product }) => {
    return (
      <TouchableOpacity
        className="bg-surface rounded-3xl overflow-hidden mb-3"
        style={{ width: '48%' }}
        activeOpacity={0.8}
      >
        <View className="relative">
          <Image
            source={{ uri: product.images[0].url }}
            className="w-full h-44 bg-background-lighter"
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-3 right-3 bg-black/30 backdrop-blur-xl rounded-full"
            activeOpacity={0.7}
            onPress={(event) => handleToggleWishlist(event, product._id)}
            disabled={isAddingToWishlist || isRemovingFromWishlist}
          >
            {isAddingToWishlist || isRemovingFromWishlist ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name={isInWishlist(product._id) ? 'heart' : 'heart-outline'}
                size={20}
                color={isInWishlist(product._id) ? '#ff6b6b' : '#fff'}
              />
            )}
          </TouchableOpacity>
        </View>
        <View className="p-3">
          <Text className="text-text-secondary text-xs mb-1">
            {product.category}
          </Text>
          <Text
            className="text-text-primary font-bold text-sm mb-2"
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="star" size={12} color="#ffc107" />
            <Text className="text-text-primary text-xs font-semibold ml-1">
              {product.averageRating.toFixed(1)}
            </Text>
            <Text className="text-text-secondary text-xs ml-1">
              ({product.totalReviews})
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-primary font-bold text-lg">
              ${product.price.toFixed(2)}
            </Text>
            <TouchableOpacity
              className="bg-primary rounded-full w-8 h-8 items-center justify-center"
              onPress={() => handleAddToCart(product._id, product.name)}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Ionicons name="add" size={18} color="#121212" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="text-text-primary mt-4">Loading products...</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View className="py-20 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color="#ff6b6b" />
        <Text className="text-text-primary font-semibold mt-4">
          Failed to load products.
        </Text>
        <Text className="text-text-secondary text-sm mt-2">
          Please try again later.
        </Text>
      </View>
    );
  }
  return (
    <FlatList
      data={products}
      scrollEnabled={false}
      renderItem={renderProduct}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={NoProductsFound}
    />
  );
};

function NoProductsFound() {
  return (
    <View className="items-center justify-center py-20">
      <Ionicons name="search-outline" size={48} color="#666" />
      <Text className="text-text-primary font-semibold mt-4">
        No products found
      </Text>
      <Text className="text-text-secondary text-sm mt-2">
        Try adjusting your filters.
      </Text>
    </View>
  );
}

export default ProductsGrid;
