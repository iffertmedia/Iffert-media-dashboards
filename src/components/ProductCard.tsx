import React from 'react';
import { View, Text, Image, Pressable, Linking, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/product';
import { cn } from '../utils/cn';

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: ViewStyle;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className, style }) => {
  const handleProductPress = async () => {
    try {
      await Linking.openURL(product.tiktokShopUrl);
    } catch (error) {
      console.error('Failed to open TikTok Shop URL:', error);
    }
  };



  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'trending': return 'bg-pink-500';
      case 'most-searched': return 'bg-purple-500';
      case 'top-product': return 'bg-orange-500';
      case 'hot-deal': return 'bg-red-500';
      case 'new-arrival': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTag = (tag: string) => {
    switch (tag) {
      case 'most-searched': return 'Most Searched';
      case 'top-product': return 'Top Product';
      case 'hot-deal': return 'Hot Deal';
      case 'new-arrival': return 'New Arrival';
      default: return tag.charAt(0).toUpperCase() + tag.slice(1);
    }
  };

  return (
    <Pressable
      onPress={handleProductPress}
      className={cn("bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", className)}
      style={style}
    >
      {/* Product Image - Square aspect ratio */}
      <View className="relative aspect-square">
        <Image
          source={{ uri: product.images[0] }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Tags Overlay */}
        {product.tags.length > 0 && (
          <View className="absolute top-2 left-2 flex-row flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag, index) => (
              <View
                key={index}
                className={cn("px-2 py-1 rounded-full", getTagColor(tag))}
              >
                <Text className="text-white text-xs font-medium">
                  {formatTag(tag)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="p-4">
        {/* Product Name */}
        <Text className="font-semibold text-gray-900 text-sm mb-2" numberOfLines={2}>
          {product.name}
        </Text>

        {/* Shop Info */}
        <Text className="text-gray-600 text-xs mb-3">
          by {product.shopName}
        </Text>

        {/* Ratings Row */}
        <View className="flex-row justify-between items-center mb-3">
          {/* Product Rating - only show if rating exists */}
          {product.starRating !== null ? (
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text className="text-sm font-medium text-gray-700 ml-1">
                {product.starRating}
              </Text>
              <Text className="text-xs text-gray-500 ml-1">
                ({product.positiveReviewPercentage}%)
              </Text>
            </View>
          ) : (
            <View />
          )}

          {/* Commission Percentage */}
          <View className="flex-row items-center">
            <Text className="text-sm font-medium text-green-600">
              {product.higherCommission || product.baseCommission}%
            </Text>
          </View>
        </View>



        {/* Action Button */}
        <Pressable
          onPress={handleProductPress}
          className="bg-black rounded-lg py-3"
        >
          <Text className="text-white text-center font-medium text-sm">
            Add to Showcase
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};