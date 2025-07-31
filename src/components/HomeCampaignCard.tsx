import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Campaign } from '../types/product';
import { cn } from '../utils/cn';

interface HomeCampaignCardProps {
  campaign: Campaign;
  onPress: (campaign: Campaign) => void;
  className?: string;
}

export const HomeCampaignCard: React.FC<HomeCampaignCardProps> = ({ campaign, onPress, className }) => {
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
          "absolute top-3 right-3 px-2 py-1 rounded-full",
          campaign.isActive ? "bg-green-500" : "bg-gray-500"
        )}>
          <Text className="text-white text-xs font-medium">
            {campaign.isActive ? 'Active' : 'Ended'}
          </Text>
        </View>


      </View>

      {/* Campaign Info */}
      <View className="p-4">
        {/* Campaign Title */}
        <View className="flex-row items-center mb-1">
          <Text className="font-bold text-base text-gray-900 flex-1" numberOfLines={1}>
            {campaign.title}
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#6b7280" />
        </View>

        {/* Description */}
        <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
          {campaign.description}
        </Text>

        {/* Stats */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-sm font-bold text-green-600">
              {campaign.totalCommission}%
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="star" size={12} color="#fbbf24" />
            <Text className="text-xs text-gray-600 ml-1">
              {campaign.averageRating}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};