import React, { useEffect, useState } from 'react';
// [converted from react-native] import { div, span, Scrolldiv, RefreshControl, Dimensions, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NotificationPopup } from '../components/NotificationPopup';
import { LogoFooter } from '../components/LogoFooter';
import { useProductStore } from '../state/useProductStore';
import { HomeProductCard } from '../components/HomeProductCard';
import { HomeCampaignCard } from '../components/HomeCampaignCard';
import { FeaturedCreatorsSlider } from '../components/FeaturedCreatorsSlider';
import { AdminFloatingButton } from '../components/auth/AdminFloatingButton';
import { fetchProductsWithFallback } from '../services/googleSheets';
import { fetchCreatorsWithFallback } from '../services/googleSheetsCreators';
import { fetchCampaignsWithFallback } from '../services/googleSheetsCampaigns';
import { mockFeaturedCreators } from '../data/mockData';
import { Product, Campaign } from '../types/product';

interface HomeScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');
const productCardWidth = (width - 48) / 3; // 3 cards per row with 16px padding on sides and 8px gaps

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { 
    products, 
    campaigns, 
    creators,
    featuredCreators,
    setProducts, 
    setCampaigns,
    setCreators,
    setFeaturedCreators,
    adminspans,
    setSelectedCategory,
    notifications,
    getActiveNotifications,
  } = useProductStore();

  const [refreshing, setRefreshing] = React.useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Use reactive notifications state and filter for active ones
  const activeNotifications = React.useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return notifications.filter(notification => 
      new Date(notification.createdAt) > thirtyDaysAgo
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications]);
  
  const unreadCount = activeNotifications.filter(n => !n.isRead).length;

  // Get editable text content
  const homepageHeaderspan = adminspans.find(t => t.key === 'homepage-header')?.content || 'Welcome Back';
  const homepageSubtitlespan = adminspans.find(t => t.key === 'homepage-subtitle')?.content || 'Discover the latest products and campaigns';
  const productsTitle = adminspans.find(t => t.key === 'homepage-products-title')?.content || 'Amazing Products';

  useEffect(() => {
    // Load data on first render
    const loadData = async () => {
      if (products.length === 0) {
        try {
          const fetchedProducts = await fetchProductsWithFallback();
          setProducts(fetchedProducts);
        } catch (error) {
          console.error('Failed to load products:', error);
        }
      }
      // Always fetch fresh campaigns from spreadsheet
      try {
        const fetchedCampaigns = await fetchCampaignsWithFallback();
        if (fetchedCampaigns.length > 0) {
          setCampaigns(fetchedCampaigns);
        }
      } catch (error) {
        console.error('Failed to load campaigns:', error);
      }
      if (creators.length === 0 || featuredCreators.length === 0) {
        try {
          const fetchedCreators = await fetchCreatorsWithFallback();
          // Store full creators in the store
          setCreators(fetchedCreators);
          
          // Convert full creators to featured creators format
          const featured = fetchedCreators.slice(0, 6).map(creator => ({
            id: creator.id,
            name: creator.name,
            avatar: creator.avatar,
            followers: creator.followers,
            tiktokHandle: creator.tiktokHandle,
            isVerified: creator.isVerified,
            specialty: creator.category
          }));
          setFeaturedCreators(featured.length > 0 ? featured : mockFeaturedCreators);
        } catch (error) {
          console.error('Failed to load featured creators:', error);
          setFeaturedCreators(mockFeaturedCreators);
        }
      }
    };

    loadData();
  }, [products.length, campaigns.length, creators.length, featuredCreators.length, setProducts, setCampaigns, setCreators, setFeaturedCreators]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const fetchedProducts = await fetchProductsWithFallback();
      setProducts(fetchedProducts);
      
      const fetchedCampaigns = await fetchCampaignsWithFallback();
      setCampaigns(fetchedCampaigns);
      
      const fetchedCreators = await fetchCreatorsWithFallback();
      // Store full creators in the store
      setCreators(fetchedCreators);
      
      const featured = fetchedCreators.slice(0, 6).map(creator => ({
        id: creator.id,
        name: creator.name,
        avatar: creator.avatar,
        followers: creator.followers,
        tiktokHandle: creator.tiktokHandle,
        isVerified: creator.isVerified,
        specialty: creator.category
      }));
      setFeaturedCreators(featured.length > 0 ? featured : mockFeaturedCreators);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    setRefreshing(false);
  }, [setProducts, setCampaigns, setCreators, setFeaturedCreators]);

  // Get 6 most recently added products (sorted by ID which contains timestamp)
  const recentProducts = React.useMemo(() => {
    if (products.length === 0) return [];
    
    return [...products].sort((a, b) => {
      // Extract timestamp from ID (IDs are generated with Date.now())
      const aTime = parseInt(a.id.split('.')[0]) || 0;
      const bTime = parseInt(b.id.split('.')[0]) || 0;
      return bTime - aTime; // Most recent first
    }).slice(0, 6);
  }, [products]);

  // Get newest campaign based on creation time (ID contains timestamp)
  const newestCampaign = React.useMemo(() => {
    if (campaigns.length === 0) return null;
    
    return [...campaigns].sort((a, b) => {
      const aTime = parseInt(a.id.split('.')[0]) || 0;
      const bTime = parseInt(b.id.split('.')[0]) || 0;
      return bTime - aTime;
    })[0];
  }, [campaigns]);

  const handleProductPress = (product: Product) => {
    // Set the category filter and navigate to products page
    setSelectedCategory(product.category);
    navigation.navigate('Products', { 
      screen: 'ProductsList',
      params: { filterCategory: product.category }
    });
  };

  const handleCampaignPress = (campaign: Campaign) => {
    navigation.navigate('Campaigns', {
      screen: 'CampaignDetail',
      params: { campaign }
    });
  };

  return (
    <div className="flex-1 bg-gray-50">
      <Scrolldiv
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <div 
          className="bg-white px-4 pb-6 border-b border-gray-100"
          style={{ paddingTop: insets.top + 4 }}
        >
          <div className="flex-row items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900 flex-1">
              {homepageHeaderspan}
            </span>
            <Pressable 
              onPress={() => setShowNotifications(true)}
              className="bg-gray-100 rounded-full p-2 relative"
            >
              <Ionicons name="notifications-outline" size={20} color="#6b7280" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </Pressable>
          </div>
          <span className="text-gray-600">
            {homepageSubtitlespan}
          </span>
        </div>

        {/* Recent Products Section */}
        <div className="mt-6">
          <div className="flex-row items-center justify-between px-4 mb-4">
            <span className="text-xl font-bold text-gray-900">
              {productsTitle}
            </span>
            <Pressable
              onPress={() => navigation.navigate('Products')}
              className="flex-row items-center"
            >
              <span className="text-sm text-blue-600 mr-1">div All</span>
              <Ionicons name="chevron-forward" size={14} color="#2563eb" />
            </Pressable>
          </div>

          {/* Product Grid - 2 rows of 3 */}
          <div className="px-4">
            {recentProducts.length > 0 ? (
              <>
                {/* First Row */}
                <div className="flex-row justify-between mb-3">
                  {recentProducts.slice(0, 3).map((product, index) => (
                    <HomeProductCard 
                      key={product.id}
                      product={product}
                      onPress={handleProductPress}
                      style={{ width: productCardWidth }}
                    />
                  ))}
                </div>
                
                {/* Second Row */}
                {recentProducts.length > 3 && (
                  <div className="flex-row justify-between">
                    {recentProducts.slice(3, 6).map((product, index) => (
                      <HomeProductCard 
                        key={product.id}
                        product={product}
                        onPress={handleProductPress}
                        style={{ width: productCardWidth }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="items-center justify-center py-8">
                <Ionicons name="cube-outline" size={48} color="#d1d5db" />
                <span className="text-gray-500 mt-2">No products available</span>
              </div>
            )}
          </div>
        </div>

        {/* Newest Campaign Section */}
        {newestCampaign && (
          <div className="mt-8">
            <div className="flex-row items-center justify-between px-4 mb-4">
              <span className="text-xl font-bold text-gray-900">
                Newest Campaign
              </span>
              <Pressable
                onPress={() => navigation.navigate('Campaigns', { screen: 'CampaignsList' })}
                className="flex-row items-center"
              >
                <span className="text-sm text-blue-600 mr-1">div All</span>
                <Ionicons name="chevron-forward" size={14} color="#2563eb" />
              </Pressable>
            </div>

            <div className="px-4">
              <HomeCampaignCard 
                campaign={newestCampaign}
                onPress={handleCampaignPress}
              />
            </div>
          </div>
        )}

        {/* Exclusive Campaigns Section */}
        <div className="mt-8">
          <div className="flex-row items-center justify-between px-4 mb-4">
            <span className="text-xl font-bold text-gray-900">
              Exclusive Opportunities
            </span>
          </div>
          <Pressable
            onPress={() => navigation.navigate('Campaigns', { screen: 'ExclusiveCampaigns' })}
            className="mx-4 bg-gradient-to-r bg-purple-50 border border-purple-200 rounded-lg p-4"
          >
            <div className="flex-row items-center justify-between">
              <div className="flex-1">
                <span className="text-lg font-bold text-purple-900 mb-1">
                  Premium Campaigns
                </span>
                <span className="text-purple-700">
                  Access exclusive partnership opportunities with higher rewards
                </span>
              </div>
              <div className="bg-purple-100 rounded-full p-2 ml-3">
                <Ionicons name="star" size={20} color="#7c3aed" />
              </div>
            </div>
          </Pressable>
        </div>

        {/* Featured Creators Section */}
        <div className="mt-8">
          <FeaturedCreatorsSlider 
            creators={featuredCreators}
            title="Meet Our Creators"
            navigation={navigation}
          />
        </div>

        {/* Logo Footer */}
        <LogoFooter />

      </Scrolldiv>

      {/* Admin Floating Button */}
      <AdminFloatingButton />
      
      {/* Notification Popup */}
      <NotificationPopup 
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};