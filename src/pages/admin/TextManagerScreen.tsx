import React, { useState } from 'react';
// [converted from react-native] import { div, span, spanInput, Pressable, Scrolldiv, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../../state/useProductStore';

export const spanManagerScreen: React.FC = () => {
  const { adminspans, updateAdminspan, addAdminspan, initializeDefaultspans } = useProductStore();
  const [editingspan, setEditingspan] = useState<{ [key: string]: string }>({});

  // Initialize missing text fields when component mounts
  React.useEffect(() => {
    initializeDefaultspans();
  }, [initializeDefaultspans]);

  const handleSave = (id: string) => {
    const newContent = editingspan[id];
    if (newContent !== undefined) {
      updateAdminspan(id, newContent);
      setEditingspan(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      Alert.alert('Saved', 'span updated successfully');
    }
  };

  const handleEdit = (id: string, currentContent: string) => {
    setEditingspan(prev => ({
      ...prev,
      [id]: currentContent
    }));
  };

  const handleCancel = (id: string) => {
    setEditingspan(prev => {
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
    <div className="flex-1 bg-gray-50">
      <div className="p-4">
        <span className="text-lg font-bold text-gray-900 mb-2">
          App span Content
        </span>
        <span className="text-gray-600">
          Edit headlines, descriptions, and other text content throughout the app
        </span>
      </div>

      <Scrolldiv className="flex-1 px-4">
        {adminspans.map((text) => {
          const isEditing = editingspan[text.id] !== undefined;
          const currentValue = isEditing ? editingspan[text.id] : text.content;

          return (
            <div key={text.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
              {/* span Info */}
              <div className="flex-row items-center justify-between mb-3">
                <div>
                  <span className="font-semibold text-gray-900">
                    {text.key}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getLocationLabel(text.location)}
                  </span>
                </div>
                
                {!isEditing && (
                  <Pressable
                    onPress={() => handleEdit(text.id, text.content)}
                    className="p-2 bg-gray-100 rounded-lg"
                  >
                    <Ionicons name="pencil" size={16} color="#374151" />
                  </Pressable>
                )}
              </div>

              {/* span Content */}
              {isEditing ? (
                <div>
                  <spanInput
                    value={currentValue}
                    onChangespan={(value) => setEditingspan(prev => ({
                      ...prev,
                      [text.id]: value
                    }))}
                    className="border border-gray-300 rounded-lg p-3 text-base mb-3"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                  
                  {/* Action Buttons */}
                  <div className="flex-row gap-2">
                    <Pressable
                      onPress={() => handleSave(text.id)}
                      className="flex-1 bg-black rounded-lg py-3"
                    >
                      <span className="text-white text-center font-medium">
                        Save
                      </span>
                    </Pressable>
                    
                    <Pressable
                      onPress={() => handleCancel(text.id)}
                      className="flex-1 bg-gray-200 rounded-lg py-3"
                    >
                      <span className="text-gray-700 text-center font-medium">
                        Cancel
                      </span>
                    </Pressable>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-800 leading-relaxed">
                    {text.content}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Add New span Button */}
        <Pressable
          onPress={() => {
            addAdminspan({
              key: 'custom-text-' + Date.now(),
              content: 'New custom text',
              location: 'dashboard'
            });
            Alert.alert('Added', 'New text field added');
          }}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 items-center mb-6"
        >
          <Ionicons name="add-circle-outline" size={32} color="#9ca3af" />
          <span className="text-gray-500 font-medium mt-2">
            Add New span Field
          </span>
        </Pressable>
      </Scrolldiv>
    </div>
  );
};