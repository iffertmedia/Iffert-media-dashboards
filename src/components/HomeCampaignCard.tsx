import React from 'react';
// [converted from react-native] import { div, span, Image, Pressable } from 'react-native';
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
      <div className="relative">
        <Image
          source={{ uri: campaign.bannerImage }}
          className="w-full h-32"
          resizeMode="cover"
        />
        
        {/* Status Badge */}
        <div className={cn(
          "absolute top-3 right-3 px-2 py-1 rounded-full",
          campaign.isActive ? "bg-green-500" : "bg-gray-500"
        )}>
          <span className="text-white text-xs font-medium">
            {campaign.isActive ? 'Active' : 'Ended'}
          </span>
        </div>


      </div>

      {/* Campaign Info */}
      <div className="p-4">
        {/* Campaign Title */}
        <div className="flex-row items-center mb-1">
          <span className="font-bold text-base text-gray-900 flex-1" numberOfLines={1}>
            {campaign.title}
          </span>
          <Ionicons name="chevron-forward" size={14} color="#6b7280" />
        </div>

        {/* Description */}
        <span className="text-sm text-gray-600 mb-3" numberOfLines={2}>
          {campaign.description}
        </span>

        {/* Stats */}
        <div className="flex-row justify-between items-center">
          <div className="flex-row items-center">
            <span className="text-sm font-bold text-green-600">
              {campaign.totalCommission}%
            </span>
          </div>

          <div className="flex-row items-center">
            <Ionicons name="star" size={12} color="#fbbf24" />
            <span className="text-xs text-gray-600 ml-1">
              {campaign.averageRating}
            </span>
          </div>
        </div>
      </div>
    </Pressable>
  );
};