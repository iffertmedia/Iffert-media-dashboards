import React, { useEffect } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../state/useProductStore';
import { ProductCard } from '../components/ProductCard';
import { LogoFooter } from '../components/LogoFooter';
import { CategoryFilter } from '../components/CategoryFilter';
import { fetchProductsWithFallback } from '../services/googleSheets';
import { cn } from '../utils/cn';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 cards per row with 16px padding on sides and 16px gap

export const DashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { 
    products, 
    setProducts, 
    searchQuery, 
    setSearchQuery, 
    filteredProducts,
    adminTexts
  } = useProductStore();

  const [refreshing, setRefreshing] = React.useState(false);

  const headerText = adminTexts.find(t => t.key === 'dashboard-header')?.content || 'TikTok Shop Affiliate Dashboard';
  const subtitleText = adminTexts.find(t => t.key === 'dashboard-subtitle')?.content || 'Tap products to get higher commissions';

  useEffect(() => {
    // Load products data on first render
    const loadProducts = async () => {
      if (products.length === 0) {
        try {
          const fetchedProducts = await fetchProductsWithFallback();
          setProducts(fetchedProducts);
        } catch (error) {
          console.error('Failed to load products:', error);
        }
      }
    };

    loadProducts();
  }, [products.length, setProducts]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const fetchedProducts = await fetchProductsWithFallback();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    setRefreshing(false);
  }, [setProducts]);

  const renderProduct = ({ item, index }: { item: typeof mockProducts[0], index: number }) => (
    <ProductCard 
      product={item} 
      style={{ width: cardWidth }}
      className={cn(
        "mb-4",
        index % 2 === 0 ? "mr-2" : "ml-2"
      )}
    />
  );

  const displayedProducts = filteredProducts();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-white px-4 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 4 }}
      >
        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {headerText}
        </Text>
        <Text className="text-gray-600 mb-4">
          {subtitleText}
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-base"
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <Ionicons 
              name="close-circle" 
              size={20} 
              color="#6b7280" 
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>

      {/* Category Filter */}
      <CategoryFilter />

      {/* Products Grid */}
      <FlatList
        data={displayedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={() => <LogoFooter />}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-16">
            <Ionicons name="search" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No products found
            </Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              Try adjusting your search or category filter
            </Text>
          </View>
        )}
      />
    </View>
  );
};