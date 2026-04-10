import ProductsGrid from '@/components/ProductsGrid';
import SafeScreen from '@/components/SafeScreen';
import useProducts from '@/hooks/useProducts';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';

const CATEGORIES = [
  { name: 'All', icon: 'grid-outline' as const },
  { name: 'Electronics', image: require('@/assets/images/electronics.png') },
  { name: 'Fashion', image: require('@/assets/images/fashion.png') },
  { name: 'Sports', image: require('@/assets/images/sports.png') },
  { name: 'Books', image: require('@/assets/images/books.png') },
];

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: products, isLoading, isError, error } = useProducts();
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const trimmedSearch = searchQuery.trim();

    let filtered = products;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search query
    if (normalizedQuery !== '') {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(normalizedQuery)
      );
    }

    return filtered;
  }, [products, searchQuery, selectedCategory]);

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View className="px-6 pb-4 pt-6">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-col items-start justify-between mb-6">
              <Text className="text-text-primary  text-3xl font-bold tracking-tight">
                Shop
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                Browse all products
              </Text>
            </View>
            <TouchableOpacity
              className="bg-surface/50 p-3 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="options-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}

          <View className="bg-surface flex-row items-center px-5 py-4 rounded-2xl">
            <Ionicons color={'#666'} size={22} name="search" />
            <TextInput
              placeholder="Search products"
              placeholderTextColor="#666"
              className="ml-3 flex-1 text-text-primary text-base"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* CATEGORY FILTER */}
        <View className="mb-6">
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.name;

              return (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center ${
                    isSelected ? 'bg-primary' : 'bg-surface'
                  }`}
                >
                  {category.icon ? (
                    <Ionicons
                      name={category.icon}
                      size={36}
                      color={isSelected ? '#121212' : '#fff'}
                    />
                  ) : (
                    <Image
                      source={category.image}
                      className="size-12"
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">
              Products
            </Text>
            <Text className="text-text-secondary text-sm">
              {isLoading
                ? 'Loading...'
                : `${filteredProducts?.length ?? 0} items`}
            </Text>
          </View>
          {isError ? (
            <Text className="text-red-400 text-sm mb-3">
              Failed to load products: {error?.message}
            </Text>
          ) : null}
          <ProductsGrid
            products={filteredProducts ?? []}
            isLoading={isLoading}
            isError={isError}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ShopScreen;
