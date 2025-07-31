import React from 'react';
// [converted from react-native] import { div, span, Image, Pressable, Linking, divStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/product';
import { cn } from '../utils/cn';

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: divStyle;
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
      <div className="relative aspect-square">
        <Image
          source={{ uri: product.images[0] }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Tags Overlay */}
        {product.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex-row flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag, index) => (
              <div
                key={index}
                className={cn("px-2 py-1 rounded-full", getTagColor(tag))}
              >
                <span className="text-white text-xs font-medium">
                  {formatTag(tag)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <span className="font-semibold text-gray-900 text-sm mb-2" numberOfLines={2}>
          {product.name}
        </span>

        {/* Shop Info */}
        <span className="text-gray-600 text-xs mb-3">
          by {product.shopName}
        </span>

        {/* Ratings Row */}
        <div className="flex-row justify-between items-center mb-3">
          {/* Product Rating - only show if rating exists */}
          {product.starRating !== null ? (
            <div className="flex-row items-center">
              <Ionicons name="star" size={14} color="#fbbf24" />
              <span className="text-sm font-medium text-gray-700 ml-1">
                {product.starRating}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({product.positiveReviewPercentage}%)
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* Commission Percentage */}
          <div className="flex-row items-center">
            <span className="text-sm font-medium text-green-600">
              {product.higherCommission || product.baseCommission}%
            </span>
          </div>
        </div>



        {/* Action Button */}
        <Pressable
          onPress={handleProductPress}
          className="bg-black rounded-lg py-3"
        >
          <span className="text-white text-center font-medium text-sm">
            Add to Showcase
          </span>
        </Pressable>
      </div>
    </Pressable>
  );
};