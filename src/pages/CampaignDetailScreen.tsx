import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Campaign } from '../types/product';
import { useProductStore } from '../state/useProductStore';
import { cn } from '../utils/cn';

interface CampaignDetailScreenProps {
  route: {
    params: {
      campaign: Campaign;
    };
  };
  navigation: any;
}

export const CampaignDetailScreen: React.FC<CampaignDetailScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const { campaign: routeCampaign } = route.params;
  const { campaigns, setCampaigns } = useProductStore();
  const insets = useSafeAreaInsets();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get the most up-to-date campaign data from the store
  const currentCampaign = campaigns.find(c => c.title === routeCampaign.title); // Match by title instead of ID
  const campaign = currentCampaign || routeCampaign;
  
  // Force re-render when the specific campaign changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
    console.log('🔄 Campaign data updated:', campaign.title);
    console.log('📊 More Info Options:', campaign.moreInfoOptions);
    console.log('📝 More Notes:', campaign.moreNotes);
    console.log('✅ Is Active:', campaign.isActive);
  }, [campaign.moreInfoOptions, campaign.moreNotes, campaign.isActive]);

  // Refresh data when screen comes into focus (preserving admin settings)
  useFocusEffect(
    React.useCallback(() => {
      console.log('🎯 Campaign details screen focused - refreshing data');
      setRefreshKey(prev => prev + 1);
      
      // Refresh campaigns from spreadsheet while preserving admin settings
      const refreshFromSpreadsheet = async () => {
        if (!isRefreshing) {
          setIsRefreshing(true);
          try {
            const { fetchCampaignsWithFallback } = require('../services/googleSheetsCampaigns');
            const freshCampaigns = await fetchCampaignsWithFallback();
            
            // Preserve existing admin settings when updating campaigns
            const mergedCampaigns = freshCampaigns.map(freshCampaign => {
              const existingCampaign = campaigns.find(c => c.title === freshCampaign.title);
              
              // If campaign exists, preserve admin settings
              if (existingCampaign) {
                return {
                  ...freshCampaign, // Update with fresh data from spreadsheet
                  moreInfoOptions: existingCampaign.moreInfoOptions || freshCampaign.moreInfoOptions, // Preserve admin toggles
                  moreNotes: existingCampaign.moreNotes || freshCampaign.moreNotes, // Preserve admin notes
                  isActive: existingCampaign.isActive !== undefined ? existingCampaign.isActive : freshCampaign.isActive, // Preserve admin-controlled status
                };
              }
              
              // New campaign - use fresh data as-is
              return freshCampaign;
            });
            
            setCampaigns(mergedCampaigns);
            console.log('🔄 Refreshed campaigns from spreadsheet (preserving admin settings)');
          } catch (error) {
            console.error('Failed to refresh campaigns:', error);
          } finally {
            setIsRefreshing(false);
          }
        }
      };
      
      refreshFromSpreadsheet();
    }, [isRefreshing, setCampaigns, campaigns])
  );
  
  // Debug logging
  console.log(`📱 Campaign Details - ${campaign.title}`);
  console.log(`💰 Total Commission: ${campaign.totalCommission}%`);
  console.log(`🖼️ Product Image URL: "${campaign.productImageUrl}"`);
  console.log(`🖼️ Banner URL: "${campaign.bannerUrl}"`);
  console.log(`🖼️ Banner Image: "${campaign.bannerImage}"`);
  console.log(`🖼️ Using banner: "${campaign.bannerUrl || campaign.bannerImage}"`);
  console.log(`✅ Active status: ${campaign.isActive}`);
  console.log('🔍 More Info Options:', campaign.moreInfoOptions);
  console.log('🔍 More Notes:', campaign.moreNotes);
  console.log('🔍 Has any more info enabled:', campaign.moreInfoOptions && Object.values(campaign.moreInfoOptions).some(Boolean));

  const handleJoinCampaign = async () => {
    if (campaign.campaignLink) {
      try {
        const canOpen = await Linking.canOpenURL(campaign.campaignLink);
        if (canOpen) {
          await Linking.openURL(campaign.campaignLink);
        } else {
          Alert.alert(
            'Invalid Link',
            'Unable to open campaign link. Please contact support.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        Alert.alert(
          'Error',
          'Unable to open campaign link. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    } else {
      // Fallback to email if no campaign link
      const subject = `Campaign Application - ${campaign.title}`;
      const body = `Hi ${campaign.sellerName},\n\nI would like to join the "${campaign.title}" campaign.\n\nPlease let me know the next steps.\n\nThank you!`;
      const emailUrl = `mailto:${campaign.contactEmail || 'hello@iffertmedia.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      try {
        await Linking.openURL(emailUrl);
      } catch (error) {
        Alert.alert(
          'Contact Required',
          'Please contact hello@iffertmedia.com to join this campaign.',
          [{ text: 'OK' }]
        );
      }
    }
  };



  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-white px-4 pb-4 border-b border-gray-100 flex-row items-center"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Pressable 
          onPress={() => navigation.goBack()}
          className="mr-4 p-2 -ml-2"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </Pressable>
        
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">
            Campaign Details
          </Text>
          <Text className="text-sm text-gray-600">
            {campaign.sellerName}
          </Text>
        </View>
        
        {campaign.isActive && (
          <Pressable 
            onPress={handleJoinCampaign}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold text-sm">
              Join Campaign
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Campaign Banner */}
        <View className="relative">
          <Image
            source={{ 
              uri: campaign.bannerUrl || campaign.bannerImage || 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800'
            }}
            className="w-full h-48"
            resizeMode="cover"
            onError={(error) => {
              console.log('🚨 Banner image failed to load:', error.nativeEvent.error);
              console.log('🔗 Attempted URL:', campaign.bannerUrl || campaign.bannerImage);
            }}
          />
          <View className="absolute inset-0 bg-black/30" />
          
          {/* Status and Commission Overlay */}
          <View className="absolute top-4 left-4 right-4 flex-row justify-between">
            <View className={`px-3 py-1 rounded-full ${campaign.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
              <Text className="text-white text-sm font-medium">
                {campaign.isActive ? 'Active Campaign' : 'Campaign Ended'}
              </Text>
            </View>
            
            <View className="bg-black/80 px-3 py-1 rounded-full">
              <Text className="text-white text-sm font-bold">
                {campaign.totalCommission}% Commission
              </Text>
            </View>
          </View>
        </View>

        {/* Campaign Info */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
          {/* Campaign Header */}
          <View className="mb-4">
            <Text className="font-bold text-xl text-gray-900 mb-1">
              {campaign.title}
            </Text>
          </View>

          {/* Description */}
          <Text className="text-gray-700 leading-relaxed mb-4">
            {campaign.description}
          </Text>

          {/* Stats */}
          <View className="flex-row justify-between bg-gray-50 rounded-lg p-4 mb-4">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                {campaign.averageRating}
              </Text>
              <Text className="text-sm text-gray-600">Product Rating</Text>
            </View>
            
            <View className="w-px bg-gray-300" />
            
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-green-600">
                {campaign.totalCommission}%
              </Text>
              <Text className="text-sm text-gray-600">Your Commission</Text>
            </View>
            
            <View className="w-px bg-gray-300" />
            
            <View className="items-center flex-1">
              <Text className={`text-2xl font-bold ${campaign.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {campaign.isActive ? 'LIVE' : 'ENDED'}
              </Text>
              <Text className="text-sm text-gray-600">Status</Text>
            </View>
          </View>



          {/* Special Offers */}
          {campaign.specialOffers && campaign.specialOffers.length > 0 && (
            <View className="border border-orange-200 bg-orange-50 rounded-lg p-3 mb-4">
              <Text className="font-medium text-orange-900 mb-2">
                🎁 Special Offers
              </Text>
              {campaign.specialOffers.map((offer, index) => (
                <Text key={index} className="text-orange-800 text-sm mb-1">
                  • {offer}
                </Text>
              ))}
            </View>
          )}
        </View>



        {/* Campaign Requirements */}
        {campaign.requirements && (
          <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">📋 Requirements</Text>
            <Text className="text-gray-700 leading-relaxed">{campaign.requirements}</Text>
          </View>
        )}

        {/* More Info */}
        {(campaign.targetAudience || campaign.productTypes || campaign.contentGuidelines || campaign.bonusCommission || campaign.paymentTerms) && (
          <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">💰 More Info</Text>
            
            {campaign.bonusCommission && (
              <View className="bg-blue-50 rounded-lg p-3 mb-3">
                <Text className="text-blue-900 font-medium mb-1">🎉 Bonus Commission</Text>
                <Text className="text-blue-800">{campaign.bonusCommission}</Text>
              </View>
            )}
            
            {campaign.targetAudience && (
              <View className="mb-3">
                <Text className="font-medium text-gray-900 mb-1">🎯 Target Audience</Text>
                <Text className="text-gray-700 leading-relaxed">{campaign.targetAudience}</Text>
              </View>
            )}
            
            {campaign.productTypes && (
              <View className="mb-3">
                <Text className="font-medium text-gray-900 mb-1">📦 Product Types</Text>
                <Text className="text-gray-700 leading-relaxed">{campaign.productTypes}</Text>
              </View>
            )}
            
            {campaign.contentGuidelines && (
              <View className="mb-3">
                <Text className="font-medium text-gray-900 mb-1">📝 Content Guidelines</Text>
                <Text className="text-gray-700 leading-relaxed">{campaign.contentGuidelines}</Text>
              </View>
            )}
            
            {campaign.paymentTerms && (
              <View>
                <Text className="font-medium text-gray-900 mb-1">Payment Terms</Text>
                <Text className="text-gray-700">{campaign.paymentTerms}</Text>
              </View>
            )}
          </View>
        )}



        {/* Deliverables & Metrics */}
        {(campaign.expectedDeliverables || campaign.performanceMetrics) && (
          <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
            {campaign.expectedDeliverables && (
              <View className="mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-2">📊 Expected Deliverables</Text>
                <Text className="text-gray-700 leading-relaxed">{campaign.expectedDeliverables}</Text>
              </View>
            )}
            
            {campaign.performanceMetrics && (
              <View>
                <Text className="text-lg font-bold text-gray-900 mb-2">📈 Performance Metrics</Text>
                <Text className="text-gray-700 leading-relaxed">{campaign.performanceMetrics}</Text>
              </View>
            )}
          </View>
        )}

        {/* Additional Information */}
        {(campaign.campaignBudget || campaign.exclusivityTerms || campaign.additionalNotes) && (
          <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">ℹ️ Additional Information</Text>
            
            {campaign.campaignBudget && (
              <View className="mb-3">
                <Text className="font-medium text-gray-900 mb-1">Campaign Budget</Text>
                <Text className="text-gray-700">{campaign.campaignBudget}</Text>
              </View>
            )}
            
            {campaign.exclusivityTerms && (
              <View className="mb-3">
                <Text className="font-medium text-gray-900 mb-1">Exclusivity Terms</Text>
                <Text className="text-gray-700">{campaign.exclusivityTerms}</Text>
              </View>
            )}
            
            {campaign.additionalNotes && (
              <View>
                <Text className="font-medium text-gray-900 mb-1">Additional Notes</Text>
                <Text className="text-gray-700">{campaign.additionalNotes}</Text>
              </View>
            )}
          </View>
        )}

        {/* Contact Information */}
        {campaign.contactEmail && (
          <View className="bg-blue-50 mx-4 mt-4 rounded-xl border border-blue-200 p-4">
            <Text className="text-lg font-bold text-blue-900 mb-2">📧 Contact</Text>
            <Text className="text-blue-800">{campaign.contactEmail}</Text>
          </View>
        )}

        {/* More Info Section */}
        {campaign.moreInfoOptions && Object.values(campaign.moreInfoOptions).some(Boolean) && (
          <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">More Info</Text>
            <View className="flex-row flex-wrap">
              {campaign.moreInfoOptions.freeSample && (
                <View className="bg-green-100 px-3 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-green-800 text-sm font-medium">✅ Free Sample</Text>
                </View>
              )}
              {campaign.moreInfoOptions.trending && (
                <View className="bg-red-100 px-3 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-red-800 text-sm font-medium">🔥 Trending</Text>
                </View>
              )}
              {campaign.moreInfoOptions.topSelling && (
                <View className="bg-yellow-100 px-3 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-yellow-800 text-sm font-medium">⭐ Top Selling</Text>
                </View>
              )}
              {campaign.moreInfoOptions.highOpportunity && (
                <View className="bg-purple-100 px-3 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-purple-800 text-sm font-medium">🚀 High Opportunity</Text>
                </View>
              )}
              {campaign.moreInfoOptions.videoOnly && (
                <View className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-blue-800 text-sm font-medium">📹 Video Only</Text>
                </View>
              )}
              {campaign.moreInfoOptions.liveOnly && (
                <View className="bg-pink-100 px-3 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-pink-800 text-sm font-medium">🔴 Live Only</Text>
                </View>
              )}
              {campaign.moreInfoOptions.videoOrLive && (
                <View className="bg-indigo-100 px-3 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-indigo-800 text-sm font-medium">📺 Video or Live</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Product Image Section */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">Product</Text>
          {campaign.productImageUrl ? (
            <Image
              source={{ uri: campaign.productImageUrl }}
              className="w-full rounded-lg"
              style={{ minHeight: 200, maxHeight: 500 }}
              resizeMode="contain"
            />
          ) : (
            <View className="w-full h-48 bg-gray-100 rounded-lg items-center justify-center">
              <Text className="text-gray-500 text-sm">Product image will appear here when added to spreadsheet</Text>
            </View>
          )}
        </View>

        {/* More Notes Section */}
        {campaign.moreNotes && (
          <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">More Notes</Text>
            <Text className="text-gray-700 leading-relaxed">{campaign.moreNotes}</Text>
          </View>
        )}

        {/* Join Campaign Button - Only show if campaign is active */}
        {campaign.isActive && (
          <View className="mx-4 mt-6 mb-4">
            <Pressable 
              onPress={handleJoinCampaign}
              className="bg-blue-600 py-4 rounded-xl items-center shadow-sm"
            >
              <Text className="text-white font-bold text-lg">
                Join Campaign
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
};