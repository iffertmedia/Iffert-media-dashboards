import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../state/useProductStore';
import { fetchCreatorsWithFallback } from '../services/googleSheetsCreators';
import { Creator } from '../types/product';

interface CreatorShowcaseScreenProps {
  navigation: any;
}

export const CreatorShowcaseScreen: React.FC<CreatorShowcaseScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { creators, setCreators, adminTexts } = useProductStore();

  const headerText = adminTexts.find(t => t.key === 'creator-header')?.content || 'Creator Showcase';
  const subtitleText = adminTexts.find(t => t.key === 'creator-subtitle')?.content || 'Top-performing TikTok creators we manage as a Creator Agency Partner';

  useEffect(() => {
    const loadCreators = async () => {
      if (creators.length === 0) {
        try {
          const fetchedCreators = await fetchCreatorsWithFallback();
          setCreators(fetchedCreators);
        } catch (error) {
          console.error('Failed to load creators:', error);
        }
      }
    };

    loadCreators();
  }, [creators.length, setCreators]);

  // GMV is now a string from spreadsheet, no formatting needed

  const handleCreatorPress = (creator: Creator) => {
    navigation.navigate('CreatorDetail', { creator });
  };

  const renderCreator = ({ item }: { item: Creator }) => (
    <Pressable
      onPress={() => handleCreatorPress(item)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mx-4 mb-4 overflow-hidden"
    >
      <View className="p-6">
        {/* Creator Header */}
        <View className="flex-row items-center mb-4">
          <Image
            source={{ uri: item.avatar }}
            className="w-16 h-16 rounded-full mr-4"
          />
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-lg font-bold text-gray-900">
                {item.name}
              </Text>
              {item.isVerified && (
                <Ionicons name="checkmark-circle" size={18} color="#0ea5e9" className="ml-2" />
              )}
            </View>
            <Text className="text-gray-600 mb-1">
              {item.tiktokHandle}
            </Text>
            <Text className="text-sm text-gray-500">
              {item.niche.join(' • ')}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between items-center bg-gray-50 rounded-lg p-4">
          <View className="items-center flex-1">
            <Text className="text-base font-bold text-green-600 mb-1">
              {item.gmv}
            </Text>
            <Text className="text-xs text-gray-600">GMV</Text>
          </View>
          
          <View className="w-px h-8 bg-gray-300" />
          
          <View className="items-center flex-1 px-1">
            <Text className="text-sm font-bold text-gray-900 text-center" numberOfLines={2} style={{ lineHeight: 16 }}>
              {item.category}
            </Text>
            <Text className="text-xs text-gray-600 mt-1">CATEGORY</Text>
          </View>
          
          <View className="w-px h-8 bg-gray-300" />
          
          <View className="items-center flex-1">
            <Text className="text-base font-bold text-gray-900">
              {item.followers}
            </Text>
            <Text className="text-xs text-gray-600">Followers</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-white px-4 pb-6 border-b border-gray-100"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {headerText}
        </Text>
        <Text className="text-gray-600">
          {subtitleText}
        </Text>
      </View>

      {/* Creators List */}
      <FlatList
        data={creators}
        renderItem={renderCreator}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-16">
            <Ionicons name="people" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No creators available
            </Text>
          </View>
        )}
      />
    </View>
  );
};