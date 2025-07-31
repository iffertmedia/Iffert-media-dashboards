import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../../state/useProductStore';

export const TextManagerScreen: React.FC = () => {
  const { adminTexts, updateAdminText, addAdminText, initializeDefaultTexts } = useProductStore();
  const [editingText, setEditingText] = useState<{ [key: string]: string }>({});

  // Initialize missing text fields when component mounts
  React.useEffect(() => {
    initializeDefaultTexts();
  }, [initializeDefaultTexts]);

  const handleSave = (id: string) => {
    const newContent = editingText[id];
    if (newContent !== undefined) {
      updateAdminText(id, newContent);
      setEditingText(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      Alert.alert('Saved', 'Text updated successfully');
    }
  };

  const handleEdit = (id: string, currentContent: string) => {
    setEditingText(prev => ({
      ...prev,
      [id]: currentContent
    }));
  };

  const handleCancel = (id: string) => {
    setEditingText(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const getLocationLabel = (location: string) => {
    switch (location) {
      case 'dashboard': return 'Dashboard';
      case 'creator-showcase': return 'Creator Showcase';
      case 'homepage': return 'Homepage';
      case 'creators-page': return 'Creators Page';
      case 'product-detail': return 'Product Detail';
      default: return location;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 mb-2">
          App Text Content
        </Text>
        <Text className="text-gray-600">
          Edit headlines, descriptions, and other text content throughout the app
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {adminTexts.map((text) => {
          const isEditing = editingText[text.id] !== undefined;
          const currentValue = isEditing ? editingText[text.id] : text.content;

          return (
            <View key={text.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
              {/* Text Info */}
              <View className="flex-row items-center justify-between mb-3">
                <View>
                  <Text className="font-semibold text-gray-900">
                    {text.key}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {getLocationLabel(text.location)}
                  </Text>
                </View>
                
                {!isEditing && (
                  <Pressable
                    onPress={() => handleEdit(text.id, text.content)}
                    className="p-2 bg-gray-100 rounded-lg"
                  >
                    <Ionicons name="pencil" size={16} color="#374151" />
                  </Pressable>
                )}
              </View>

              {/* Text Content */}
              {isEditing ? (
                <View>
                  <TextInput
                    value={currentValue}
                    onChangeText={(value) => setEditingText(prev => ({
                      ...prev,
                      [text.id]: value
                    }))}
                    className="border border-gray-300 rounded-lg p-3 text-base mb-3"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                  
                  {/* Action Buttons */}
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => handleSave(text.id)}
                      className="flex-1 bg-black rounded-lg py-3"
                    >
                      <Text className="text-white text-center font-medium">
                        Save
                      </Text>
                    </Pressable>
                    
                    <Pressable
                      onPress={() => handleCancel(text.id)}
                      className="flex-1 bg-gray-200 rounded-lg py-3"
                    >
                      <Text className="text-gray-700 text-center font-medium">
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View className="bg-gray-50 rounded-lg p-3">
                  <Text className="text-gray-800 leading-relaxed">
                    {text.content}
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Add New Text Button */}
        <Pressable
          onPress={() => {
            addAdminText({
              key: 'custom-text-' + Date.now(),
              content: 'New custom text',
              location: 'dashboard'
            });
            Alert.alert('Added', 'New text field added');
          }}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center mb-6"
        >
          <Ionicons name="add-circle-outline" size={32} color="#9ca3af" />
          <Text className="text-gray-500 font-medium mt-2">
            Add New Text Field
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};