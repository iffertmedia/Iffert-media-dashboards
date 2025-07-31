import React, { useEffect, useState } from 'react';
// [converted from react-native] import { div, span, FlatList, RefreshControl, Pressable, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../state/useProductStore';
import { LogoFooter } from '../components/LogoFooter';
import { fetchExclusiveCampaignsWithFallback } from '../services/googleSheetsExclusiveCampaigns';
import { ExclusiveCampaign } from '../types/product';

interface ExclusiveCampaignsScreenProps {
  navigation: any;
}

export const ExclusiveCampaignsScreen: React.FC<ExclusiveCampaignsScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { exclusiveCampaigns, setExclusiveCampaigns } = useProductStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadExclusiveCampaigns = async () => {
      try {
        const campaigns = await fetchExclusiveCampaignsWithFallback();
        setExclusiveCampaigns(campaigns);
      } catch (error) {
        console.error('Failed to load exclusive campaigns:', error);
      }
    };

    loadExclusiveCampaigns();
  }, [setExclusiveCampaigns]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const campaigns = await fetchExclusiveCampaignsWithFallback();
      setExclusiveCampaigns(campaigns);
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    setRefreshing(false);
  }, [setExclusiveCampaigns]);

  const handleCampaignPress = (campaign: ExclusiveCampaign) => {
    if (campaign.link) {
      Linking.openURL(campaign.link);
    }
  };

  const renderCampaign = ({ item }: { item: ExclusiveCampaign }) => (
    <Pressable
      onPress={() => handleCampaignPress(item)}
      className="mx-4 mb-4 bg-white rounded-lg p-4 border border-gray-200"
    >
      <div className="flex-row items-center justify-between mb-2">
        <div className="bg-blue-100 px-3 py-1 rounded-full">
          <span className="text-blue-800 text-sm font-medium">{item.category}</span>
        </div>
        {item.endDate && (
          <span className="text-gray-500 text-sm">Ends: {item.endDate}</span>
        )}
      </div>
      
      <span className="text-gray-600 mb-3">{item.description}</span>
      
      <div className="flex-row items-center justify-between">
        <span className="text-blue-600 font-medium">Tap to open campaign</span>
        <Ionicons name="arrow-forward" size={16} color="#2563eb" />
      </div>
    </Pressable>
  );

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div 
        className="bg-white px-4 pb-4 border-b border-gray-100"
        style={{ paddingTop: insets.top + 4 }}
      >
        <div className="flex-row items-center mb-4">
          <Pressable onPress={() => navigation.goBack()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <span className="text-2xl font-bold text-gray-900 flex-1">
            Exclusive Campaigns
          </span>
        </div>
        <span className="text-gray-600">
          Premium partnership opportunities with exclusive access
        </span>
      </div>

      {/* Campaigns List */}
      <FlatList
        data={exclusiveCampaigns}
        renderItem={renderCampaign}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 60 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={() => <LogoFooter />}
        ListEmptyComponent={() => (
          <div className="flex-1 items-center justify-center py-16">
            <Ionicons name="star" size={48} color="#d1d5db" />
            <span className="text-gray-500 text-lg font-medium mt-4">
              No exclusive campaigns available
            </span>
            <span className="text-gray-400 text-center mt-2 px-8">
              Check back soon for new opportunities
            </span>
          </div>
        )}
      />
    </div>
  );
};