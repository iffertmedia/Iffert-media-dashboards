import React, { useState } from 'react';
// [converted from react-native] import { div, span, Scrolldiv, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../../state/useProductStore';

export const CreatorCollabAdmin: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { creators, updateCreatorCollabOptions } = useProductStore();

  const handleCollabOptionChange = (creatorId: string, option: 'freeSample' | 'paidCollab' | 'retainer', value: boolean) => {
    const creator = creators.find(c => c.id === creatorId);
    if (creator) {
      const currentOptions = creator.collabOptions || { freeSample: true, paidCollab: true, retainer: true };
      updateCreatorCollabOptions(creatorId, {
        ...currentOptions,
        [option]: value
      });
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div 
        className="bg-white px-4 pb-4 border-b border-gray-100 flex-row items-center"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Pressable 
          onPress={() => navigation.goBack()}
          className="mr-4 p-2 -ml-2"
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </Pressable>
        
        <span className="text-lg font-bold text-gray-900">
          Creator Collab Options
        </span>
      </div>

      <Scrolldiv 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        <div className="px-4 py-4">
          <span className="text-sm text-gray-600 mb-6">
            Configure collaboration options for each creator. These will appear as checkmarks on their detail pages.
          </span>

          {creators.map((creator) => {
            const options = creator.collabOptions || { freeSample: true, paidCollab: true, retainer: true };
            
            return (
              <div key={creator.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                <div className="flex-row items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900 flex-1">
                    {creator.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {creator.tiktokHandle}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex-row items-center justify-between py-2">
                    <div className="flex-row items-center">
                      <span className="text-green-600 mr-2">✅</span>
                      <span className="text-gray-900 font-medium">FREE SAMPLE</span>
                    </div>
                    <Switch
                      value={options.freeSample}
                      onValueChange={(value) => handleCollabOptionChange(creator.id, 'freeSample', value)}
                      trackColor={{ false: '#d1d5db', true: '#10b981' }}
                      thumbColor={options.freeSample ? '#ffffff' : '#f3f4f6'}
                    />
                  </div>

                  <div className="flex-row items-center justify-between py-2">
                    <div className="flex-row items-center">
                      <span className="text-green-600 mr-2">✅</span>
                      <span className="text-gray-900 font-medium">PAID COLLAB</span>
                    </div>
                    <Switch
                      value={options.paidCollab}
                      onValueChange={(value) => handleCollabOptionChange(creator.id, 'paidCollab', value)}
                      trackColor={{ false: '#d1d5db', true: '#10b981' }}
                      thumbColor={options.paidCollab ? '#ffffff' : '#f3f4f6'}
                    />
                  </div>

                  <div className="flex-row items-center justify-between py-2">
                    <div className="flex-row items-center">
                      <span className="text-green-600 mr-2">✅</span>
                      <span className="text-gray-900 font-medium">RETAINER</span>
                    </div>
                    <Switch
                      value={options.retainer}
                      onValueChange={(value) => handleCollabOptionChange(creator.id, 'retainer', value)}
                      trackColor={{ false: '#d1d5db', true: '#10b981' }}
                      thumbColor={options.retainer ? '#ffffff' : '#f3f4f6'}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Scrolldiv>
    </div>
  );
};