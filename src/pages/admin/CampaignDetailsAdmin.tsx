import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../../state/useProductStore';

export const CampaignDetailsAdmin: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { campaigns, updateCampaignMoreNotes, updateCampaignMoreInfoOptions, updateCampaignStatus } = useProductStore();
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  const handleMoreInfoToggle = (campaignId: string, option: keyof NonNullable<typeof campaigns[0]['moreInfoOptions']>, value: boolean) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      const currentOptions = campaign.moreInfoOptions || {
        freeSample: false,
        trending: false,
        topSelling: false,
        highOpportunity: false,
        videoOnly: false,
        liveOnly: false,
        videoOrLive: false
      };
      updateCampaignMoreInfoOptions(campaignId, {
        ...currentOptions,
        [option]: value
      });
    }
  };

  const handleNotesChange = (campaignId: string, text: string) => {
    setEditingNotes(prev => ({ ...prev, [campaignId]: text }));
  };

  const saveNotes = (campaignId: string) => {
    const notes = editingNotes[campaignId] || '';
    updateCampaignMoreNotes(campaignId, notes);
    Alert.alert('Success', 'Notes saved successfully');
  };

  return (
    <View className="flex-1 bg-gray-50">
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
        <Text className="text-lg font-bold text-gray-900">Campaign Admin</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
        {campaigns.map((campaign) => {
          const options = campaign.moreInfoOptions || {
            freeSample: false,
            trending: false,
            topSelling: false,
            highOpportunity: false,
            videoOnly: false,
            liveOnly: false,
            videoOrLive: false
          };
          
          return (
            <View key={campaign.id} className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
              <Text className="text-lg font-semibold text-gray-900 mb-3">{campaign.title}</Text>
              
              {/* Campaign Status */}
              <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <Text className="text-gray-900 font-medium">Campaign Active</Text>
                <Switch
                  value={campaign.isActive}
                  onValueChange={(value) => updateCampaignStatus(campaign.id, value)}
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor={campaign.isActive ? '#ffffff' : '#f3f4f6'}
                />
              </View>

              {/* More Info Options */}
              <Text className="font-semibold text-gray-900 mb-2">More Info Options</Text>
              {[
                { key: 'freeSample', label: '✅ Free Sample' },
                { key: 'trending', label: '🔥 Trending' },
                { key: 'topSelling', label: '⭐ Top Selling' },
                { key: 'highOpportunity', label: '🚀 High Opportunity' },
                { key: 'videoOnly', label: '📹 Video Only' },
                { key: 'liveOnly', label: '🔴 Live Only' },
                { key: 'videoOrLive', label: '📺 Video or Live' }
              ].map(({ key, label }) => (
                <View key={key} className="flex-row items-center justify-between py-1">
                  <Text className="text-gray-700">{label}</Text>
                  <Switch
                    value={options[key as keyof typeof options]}
                    onValueChange={(value) => handleMoreInfoToggle(campaign.id, key as keyof typeof options, value)}
                    trackColor={{ false: '#d1d5db', true: '#10b981' }}
                    thumbColor={options[key as keyof typeof options] ? '#ffffff' : '#f3f4f6'}
                  />
                </View>
              ))}

              {/* More Notes */}
              <View className="mt-4 pt-3 border-t border-gray-200">
                <Text className="font-semibold text-gray-900 mb-2">More Notes</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 text-gray-900 mb-2"
                  placeholder="Enter additional notes for this campaign..."
                  multiline
                  numberOfLines={3}
                  value={editingNotes[campaign.id] ?? campaign.moreNotes ?? ''}
                  onChangeText={(text) => handleNotesChange(campaign.id, text)}
                />
                <Pressable
                  onPress={() => saveNotes(campaign.id)}
                  className="bg-blue-600 py-2 px-4 rounded-lg self-start"
                >
                  <Text className="text-white font-medium">Save Notes</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};