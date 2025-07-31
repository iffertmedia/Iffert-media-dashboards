import React from 'react';
// [converted from react-native] import { div, span, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/product';
import { cn } from '../utils/cn';

interface HomeProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  className?: string;
  style?: any;
}

export const HomeProductCard: React.FC<HomeProductCardProps> = ({ product, onPress, className, style }) => {
  const handlePress = () => {
    onPress(product);
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
      onPress={handlePress}
      className={cn("bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden", className)}
      style={style}
    >
      {/* Product Image */}
      <div className="relative">
        <Image
          source={{ uri: product.images[0] }}
          className="w-full h-24"
          resizeMode="cover"
        />
        
        {/* Tag Badge */}
        {product.tags.length > 0 && (
          <div className="absolute top-1 left-1">
            <div className={cn("px-1.5 py-0.5 rounded-full", getTagColor(product.tags[0]))}>
              <span className="text-white text-xs font-medium">
                {formatTag(product.tags[0])}
              </span>
            </div>
          </div>
        )}


      </div>

      {/* Product Info */}
      <div className="p-2">
        {/* Product Name */}
        <span className="font-semibold text-gray-900 text-xs mb-1" numberOfLines={2}>
          {product.name}
        </span>

        {/* Commission & Rating */}
        <div className="flex-row items-center justify-between">
          <span className="font-bold text-sm text-green-600">
            {product.higherCommission || product.baseCommission}%
          </span>
          {product.starRating !== null ? (
            <div className="flex-row items-center">
              <Ionicons name="star" size={10} color="#fbbf24" />
              <span className="text-xs text-gray-600 ml-0.5">
                {product.starRating}
              </span>
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </Pressable>
  );
};