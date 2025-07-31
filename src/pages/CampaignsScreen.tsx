import React, { useEffect } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../state/useProductStore';
import { CampaignCard } from '../components/CampaignCard';
import { LogoFooter } from '../components/LogoFooter';
import { fetchCampaignsWithFallback } from '../services/googleSheetsCampaigns';
import { Campaign } from '../types/product';
import { cn } from '../utils/cn';

interface CampaignsScreenProps {
  navigation: any;
}

export const CampaignsScreen: React.FC<CampaignsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { campaigns, setCampaigns } = useProductStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'active' | 'ended' | 'newest'>('newest');

  useEffect(() => {
    const loadCampaigns = async () => {
      // Always fetch fresh campaigns from spreadsheet
      try {
        console.log('🔄 Loading fresh campaigns from spreadsheet...');
        const fetchedCampaigns = await fetchCampaignsWithFallback();
        console.log('✅ Loaded campaigns:', fetchedCampaigns.length);
        setCampaigns(fetchedCampaigns);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
      }
    };

    loadCampaigns();
  }, [setCampaigns]);



  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const fetchedCampaigns = await fetchCampaignsWithFallback();
      setCampaigns(fetchedCampaigns);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    setRefreshing(false);
  }, [setCampaigns]);

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      console.log('🔄 Forcing campaigns refresh from spreadsheet...');
      // Clear existing campaigns first to force fresh fetch
      setCampaigns([]);
      const fetchedCampaigns = await fetchCampaignsWithFallback();
      console.log('✅ Fetched campaigns:', fetchedCampaigns.length);
      setCampaigns(fetchedCampaigns);
      Alert.alert('Success', `Campaigns refreshed from spreadsheet (${fetchedCampaigns.length} campaigns)`);
    } catch (error) {
      console.error('Campaign refresh error:', error);
      Alert.alert('Error', 'Failed to refresh campaigns from spreadsheet');
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const handleCampaignPress = (campaign: Campaign) => {
    navigation.navigate('CampaignDetail', { campaign });
  };

  const filteredCampaigns = React.useMemo(() => {
    let filtered = campaigns;

    // Filter by status
    if (filter === 'active') {
      filtered = filtered.filter(c => c.isActive);
    } else if (filter === 'ended') {
      filtered = filtered.filter(c => !c.isActive);
    } else if (filter === 'newest') {
      // Sort by newest first (campaigns are added with most recent timestamps)
      filtered = [...campaigns].sort((a, b) => {
        // Use ID as timestamp since it contains Date.now()
        const aTime = parseInt(a.id.split('.')[0]) || 0;
        const bTime = parseInt(b.id.split('.')[0]) || 0;
        return bTime - aTime;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.sellerName.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }

    // If not filtering by newest, still sort by newest by default
    if (filter !== 'newest') {
      filtered = [...filtered].sort((a, b) => {
        const aTime = parseInt(a.id.split('.')[0]) || 0;
        const bTime = parseInt(b.id.split('.')[0]) || 0;
        return bTime - aTime;
      });
    }

    return filtered;
  }, [campaigns, filter, searchQuery]);

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <CampaignCard 
      campaign={item} 
      onPress={handleCampaignPress}
      className="mx-4 mb-4"
    />
  );

  const renderFilterButton = (filterType: typeof filter, label: string) => {
    const isSelected = filter === filterType;
    return (
      <Pressable
        onPress={() => setFilter(filterType)}
        className={cn(
          "px-4 py-2 rounded-full mr-3 border",
          isSelected 
            ? "bg-black border-black" 
            : "bg-gray-50 border-gray-200"
        )}
      >
        <Text
          className={cn(
            "font-medium text-sm",
            isSelected ? "text-white" : "text-gray-600"
          )}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-white px-4 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 4 }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-2xl font-bold text-gray-900">
            Partner Campaigns
          </Text>
          <Pressable
            onPress={handleManualRefresh}
            disabled={isManualRefreshing}
            className="bg-gray-100 rounded-lg p-2"
          >
            {isManualRefreshing ? (
              <ActivityIndicator size="small" color="#6b7280" />
            ) : (
              <Ionicons name="refresh" size={20} color="#6b7280" />
            )}
          </Pressable>
        </View>
        <Text className="text-gray-600 mb-4">
          Exclusive seller partnerships with higher commissions
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search campaigns..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-base"
            placeholderTextColor="#9ca3af"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </Pressable>
          )}
        </View>

        {/* Filter Buttons */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {renderFilterButton('newest', 'Newest')}
          {renderFilterButton('all', 'All Campaigns')}
          {renderFilterButton('active', 'Active')}
          {renderFilterButton('ended', 'Ended')}
          <Pressable
            onPress={() => navigation.navigate('ExclusiveCampaigns')}
            className="px-4 py-2 rounded-full mr-3 border bg-purple-50 border-purple-200"
          >
            <Text className="font-medium text-sm text-purple-700">
              Exclusive
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Campaigns List */}
      <FlatList
        data={filteredCampaigns}
        renderItem={renderCampaign}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-16">
            <Ionicons name="megaphone" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No campaigns found
            </Text>
            <Text className="text-gray-400 text-center mt-2 px-8">
              Try adjusting your search or filter
            </Text>
          </View>
        )}
        ListFooterComponent={() => <LogoFooter />}
      />
    </View>
  );
};