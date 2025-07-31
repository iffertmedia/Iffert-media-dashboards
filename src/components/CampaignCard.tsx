import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Campaign } from '../types/product';
import { cn } from '../utils/cn';

interface CampaignCardProps {
  campaign: Campaign;
  onPress: (campaign: Campaign) => void;
  className?: string;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onPress, className }) => {
  const handlePress = () => {
    onPress(campaign);
  };

  return (
    <Pressable
      onPress={handlePress}
      className={cn("bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)}
    >
      {/* Banner Image */}
      <View className="relative">
        <Image
          source={{ uri: campaign.bannerImage }}
          className="w-full h-32"
          resizeMode="cover"
        />
        
        {/* Status Badge */}
        <View className={cn(
          "absolute top-3 right-3 px-3 py-1 rounded-full",
          campaign.isActive ? "bg-green-500" : "bg-gray-500"
        )}>
          <Text className="text-white text-xs font-medium">
            {campaign.isActive ? 'Active' : 'Ended'}
          </Text>
        </View>

        {/* Commission Badge */}
        <View className="absolute top-3 left-3 bg-black/80 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold">
            {campaign.totalCommission}%
          </Text>
        </View>
      </View>

      {/* Campaign Info */}
      <View className="p-4">
        {/* Campaign Title with Rating */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-bold text-base text-gray-900 flex-1" numberOfLines={2}>
            {campaign.title}
          </Text>
          <View className="flex-row items-center ml-2">
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text className="text-sm text-gray-600 ml-1">
              {campaign.averageRating}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
          {campaign.description}
        </Text>

        {/* Special Offers */}
        {campaign.specialOffers && campaign.specialOffers.length > 0 && (
          <View className="bg-blue-50 rounded-lg p-3 mb-3">
            <Text className="text-xs font-medium text-blue-800 mb-1">
              Special Offers:
            </Text>
            <Text className="text-xs text-blue-700" numberOfLines={2}>
              {campaign.specialOffers[0]}
              {campaign.specialOffers.length > 1 && ` +${campaign.specialOffers.length - 1} more`}
            </Text>
          </View>
        )}

        {/* CTA Button */}
        <Pressable
          onPress={handlePress}
          className="bg-black rounded-lg py-3 flex-row items-center justify-center"
        >
          <Text className="text-white font-medium text-sm mr-2">
            View Campaign
          </Text>
          <Ionicons name="chevron-forward" size={16} color="white" />
        </Pressable>
      </View>
    </Pressable>
  );
};