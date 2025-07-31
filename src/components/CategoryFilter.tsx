import React from 'react';
// [converted from react-native] import { div, span, Pressable, Scrolldiv } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductCategory } from '../types/product';
import { useProductStore } from '../state/useProductStore';
import { cn } from '../utils/cn';

const categories: Array<{ key: ProductCategory | 'all'; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { key: 'all', label: 'All', icon: 'apps' },
  { key: 'fashion', label: 'Fashion', icon: 'shirt' },
  { key: 'accessories', label: 'Accessories', icon: 'watch' },
  { key: 'beauty', label: 'Beauty', icon: 'flower' },
  { key: 'personal care', label: 'Personal Care', icon: 'medical' },
  { key: 'health', label: 'Health', icon: 'fitness' },
  { key: 'food', label: 'Food', icon: 'restaurant' },
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'pet', label: 'Pet', icon: 'paw' },
  { key: 'toys', label: 'Toys', icon: 'game-controller' },
  { key: 'tech', label: 'Tech', icon: 'phone-portrait' }
];

export const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useProductStore();

  return (
    <div className="bg-white border-b border-gray-100">
      <Scrolldiv 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        className="flex-row"
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.key;
          
          return (
            <Pressable
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              className={cn(
                "flex-row items-center px-4 py-2 rounded-full mr-3 border",
                isSelected 
                  ? "bg-black border-black" 
                  : "bg-gray-50 border-gray-200"
              )}
            >
              <Ionicons
                name={category.icon}
                size={16}
                color={isSelected ? "#ffffff" : "#6b7280"}
              />
              <span
                className={cn(
                  "ml-2 font-medium text-sm",
                  isSelected ? "text-white" : "text-gray-600"
                )}
              >
                {category.label}
              </span>
            </Pressable>
          );
        })}
      </Scrolldiv>
    </div>
  );
};