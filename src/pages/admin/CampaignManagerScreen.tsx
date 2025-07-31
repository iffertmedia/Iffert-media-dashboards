import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, FlatList, Switch, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../../state/useProductStore';
import { Campaign, ProductCategory } from '../../types/product';
import { FormField, SelectField, ImageInput } from '../../components/admin/FormComponents';

export const CampaignManagerScreen: React.FC = () => {
  const { campaigns, setCampaigns, updateCampaignMoreNotes, updateCampaignMoreInfoOptions, updateCampaignStatus } = useProductStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminCampaign, setAdminCampaign] = useState<Campaign | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  // Form state
  const [formData, setFormData] = useState<Partial<Campaign>>({
    title: '',
    description: '',
    sellerName: '',
    sellerLogo: '',
    bannerImage: '',
    totalCommission: 15,
    averageRating: 4.5,
    category: 'beauty',
    isActive: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    specialOffers: []
  });

  const categoryOptions = [
    { label: 'Beauty', value: 'beauty' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Tech', value: 'tech' },
    { label: 'Health', value: 'health' },
    { label: 'Home', value: 'home' },
    { label: 'Sports', value: 'sports' },
    { label: 'Pets', value: 'pets' },
    { label: 'Food', value: 'food' },
    { label: 'Toys', value: 'toys' },
    { label: 'Automotive', value: 'automotive' }
  ];

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      ...campaign,
      specialOffers: campaign.specialOffers || []
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingCampaign(null);
    setFormData({
      title: '',
      description: '',
      sellerName: '',
      sellerLogo: '',
      bannerImage: '',
      totalCommission: 15,
      averageRating: 4.5,
      category: 'beauty',
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      specialOffers: []
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.sellerName || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const campaignData: Campaign = {
      id: editingCampaign?.id || Date.now().toString(),
      title: formData.title!,
      description: formData.description!,
      sellerName: formData.sellerName!,
      sellerLogo: formData.sellerLogo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      bannerImage: formData.bannerImage || 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800',
      totalCommission: formData.totalCommission!,
      averageRating: formData.averageRating!,
      category: formData.category as ProductCategory,
      isActive: formData.isActive!,
      startDate: formData.startDate!,
      endDate: formData.endDate,
      specialOffers: formData.specialOffers
    };

    if (isEditing) {
      const updatedCampaigns = campaigns.map(c => c.id === editingCampaign?.id ? campaignData : c);
      setCampaigns(updatedCampaigns);
    } else {
      setCampaigns([...campaigns, campaignData]);
    }

    setShowForm(false);
    Alert.alert('Success', `Campaign ${isEditing ? 'updated' : 'added'} successfully`);
  };

  const handleDelete = (campaign: Campaign) => {
    Alert.alert(
      'Delete Campaign',
      `Are you sure you want to delete "${campaign.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedCampaigns = campaigns.filter(c => c.id !== campaign.id);
            setCampaigns(updatedCampaigns);
          }
        }
      ]
    );
  };

  const toggleCampaignStatus = (campaign: Campaign) => {
    const updatedCampaigns = campaigns.map(c => 
      c.id === campaign.id ? { ...c, isActive: !c.isActive } : c
    );
    setCampaigns(updatedCampaigns);
  };

  const handleAdminPanel = (campaign: Campaign) => {
    setAdminCampaign(campaign);
    setEditingNotes(campaign.moreNotes || '');
    setShowAdminPanel(true);
  };

  const handleMoreInfoToggle = (option: keyof NonNullable<typeof adminCampaign['moreInfoOptions']>, value: boolean) => {
    if (adminCampaign) {
      const currentOptions = adminCampaign.moreInfoOptions || {
        freeSample: false,
        trending: false,
        topSelling: false,
        highOpportunity: false,
        videoOnly: false,
        liveOnly: false,
        videoOrLive: false
      };
      updateCampaignMoreInfoOptions(adminCampaign.id, {
        ...currentOptions,
        [option]: value
      });
      
      // Update local state
      setAdminCampaign({
        ...adminCampaign,
        moreInfoOptions: {
          ...currentOptions,
          [option]: value
        }
      });
    }
  };

  const saveNotes = () => {
    if (adminCampaign) {
      updateCampaignMoreNotes(adminCampaign.id, editingNotes);
      Alert.alert('Success', 'Notes saved successfully');
    }
  };

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <Pressable 
      onPress={() => handleAdminPanel(item)}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-3"
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-semibold text-gray-900 flex-1" numberOfLines={1}>
          {item.title}
        </Text>
        <View className="flex-row ml-2">
          <Pressable onPress={(e) => {
            e.stopPropagation();
            toggleCampaignStatus(item);
          }} className="p-2">
            <Ionicons 
              name={item.isActive ? "pause-circle" : "play-circle"} 
              size={18} 
              color={item.isActive ? "#ef4444" : "#10b981"} 
            />
          </Pressable>
          <Pressable onPress={(e) => {
            e.stopPropagation();
            handleEdit(item);
          }} className="p-2">
            <Ionicons name="pencil" size={16} color="#6b7280" />
          </Pressable>
          <Pressable onPress={(e) => {
            e.stopPropagation();
            handleDelete(item);
          }} className="p-2">
            <Ionicons name="trash" size={16} color="#ef4444" />
          </Pressable>
        </View>
      </View>
      
      <Text className="text-sm text-gray-600 mb-1">by {item.sellerName}</Text>
      <Text className="text-sm text-gray-600 mb-2">{item.category} • Up to {item.totalCommission}% commission</Text>
      
      <View className="flex-row items-center justify-between">
        <View className={`px-2 py-1 rounded-full ${item.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Text className={`text-xs font-medium ${item.isActive ? 'text-green-800' : 'text-gray-600'}`}>
            {item.isActive ? 'Active' : 'Paused'}
          </Text>
        </View>
        <Text className="font-bold text-sm text-gray-900">Up to {item.totalCommission}%</Text>
      </View>
    </Pressable>
  );

  if (showAdminPanel && adminCampaign) {
    const options = adminCampaign.moreInfoOptions || {
      freeSample: false,
      trending: false,
      topSelling: false,
      highOpportunity: false,
      videoOnly: false,
      liveOnly: false,
      videoOrLive: false
    };

    return (
      <ScrollView className="flex-1 bg-gray-50 p-4">
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Campaign Settings</Text>
            <Pressable onPress={() => setShowAdminPanel(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </Pressable>
          </View>

          <Text className="text-base font-semibold text-gray-900 mb-3">{adminCampaign.title}</Text>
          
          {/* Campaign Status */}
          <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <Text className="text-gray-900 font-medium">Campaign Active</Text>
            <Switch
              value={adminCampaign.isActive}
              onValueChange={(value) => {
                updateCampaignStatus(adminCampaign.id, value);
                setAdminCampaign({...adminCampaign, isActive: value});
              }}
              trackColor={{ false: '#d1d5db', true: '#10b981' }}
              thumbColor={adminCampaign.isActive ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          {/* More Info Options */}
          <Text className="font-semibold text-gray-900 mb-3">More Info Options</Text>
          {[
            { key: 'freeSample', label: '✅ Free Sample' },
            { key: 'trending', label: '🔥 Trending' },
            { key: 'topSelling', label: '⭐ Top Selling' },
            { key: 'highOpportunity', label: '🚀 High Opportunity' },
            { key: 'videoOnly', label: '📹 Video Only' },
            { key: 'liveOnly', label: '🔴 Live Only' },
            { key: 'videoOrLive', label: '📺 Video or Live' }
          ].map(({ key, label }) => (
            <View key={key} className="flex-row items-center justify-between py-2">
              <Text className="text-gray-700">{label}</Text>
              <Switch
                value={options[key as keyof typeof options]}
                onValueChange={(value) => handleMoreInfoToggle(key as keyof typeof options, value)}
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
              value={editingNotes}
              onChangeText={setEditingNotes}
            />
            <Pressable
              onPress={saveNotes}
              className="bg-blue-600 py-2 px-4 rounded-lg self-start"
            >
              <Text className="text-white font-medium">Save Notes</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (showForm) {
    return (
      <ScrollView className="flex-1 bg-gray-50 p-4">
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              {isEditing ? 'Edit Campaign' : 'Add New Campaign'}
            </Text>
            <Pressable onPress={() => setShowForm(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </Pressable>
          </View>

          <FormField
            label="Campaign Title"
            value={formData.title || ''}
            onChangeText={(text) => setFormData({...formData, title: text})}
            placeholder="Enter campaign title"
            required
          />

          <FormField
            label="Seller Name"
            value={formData.sellerName || ''}
            onChangeText={(text) => setFormData({...formData, sellerName: text})}
            placeholder="Enter seller name"
            required
          />

          <FormField
            label="Description"
            value={formData.description || ''}
            onChangeText={(text) => setFormData({...formData, description: text})}
            placeholder="Enter campaign description"
            multiline
            required
          />

          <SelectField
            label="Category"
            value={formData.category || 'beauty'}
            options={categoryOptions}
            onSelect={(value) => setFormData({...formData, category: value as ProductCategory})}
            required
          />

          <ImageInput
            label="Seller Logo"
            urls={formData.sellerLogo ? [formData.sellerLogo] : []}
            onUrlsChange={(urls) => setFormData({...formData, sellerLogo: urls[0] || ''})}
            maxImages={1}
          />

          <ImageInput
            label="Banner Image"
            urls={formData.bannerImage ? [formData.bannerImage] : []}
            onUrlsChange={(urls) => setFormData({...formData, bannerImage: urls[0] || ''})}
            maxImages={1}
          />

          <View className="flex-row space-x-4 mb-4">
            <View className="flex-1">
              <FormField
                label="Total Commission %"
                value={formData.totalCommission?.toString() || ''}
                onChangeText={(text) => setFormData({...formData, totalCommission: parseInt(text) || 0})}
                placeholder="15"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Average Rating"
                value={formData.averageRating?.toString() || ''}
                onChangeText={(text) => setFormData({...formData, averageRating: parseFloat(text) || 0})}
                placeholder="4.5"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View className="flex-row space-x-4 mb-4">
            <View className="flex-1">
              <FormField
                label="Start Date"
                value={formData.startDate || ''}
                onChangeText={(text) => setFormData({...formData, startDate: text})}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View className="flex-1">
              <FormField
                label="End Date (Optional)"
                value={formData.endDate || ''}
                onChangeText={(text) => setFormData({...formData, endDate: text})}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          {/* Special Offers */}
          <Text className="text-sm font-medium text-gray-700 mb-2">Special Offers</Text>
          {(formData.specialOffers || []).map((offer, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <FormField
                label=""
                value={offer}
                onChangeText={(text) => {
                  const updatedOffers = [...(formData.specialOffers || [])];
                  updatedOffers[index] = text;
                  setFormData({...formData, specialOffers: updatedOffers});
                }}
                placeholder="Enter special offer"
              />
              <Pressable
                onPress={() => {
                  const updatedOffers = (formData.specialOffers || []).filter((_, i) => i !== index);
                  setFormData({...formData, specialOffers: updatedOffers});
                }}
                className="ml-2 p-2"
              >
                <Ionicons name="trash" size={16} color="#ef4444" />
              </Pressable>
            </View>
          ))}
          
          <Pressable
            onPress={() => {
              const updatedOffers = [...(formData.specialOffers || []), ''];
              setFormData({...formData, specialOffers: updatedOffers});
            }}
            className="border-2 border-dashed border-gray-300 rounded-lg p-3 items-center mb-4"
          >
            <Text className="text-gray-500 text-sm">+ Add Special Offer</Text>
          </Pressable>

          {/* Status Toggle */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-sm font-medium text-gray-700">Campaign Status</Text>
            <Pressable
              onPress={() => setFormData({...formData, isActive: !formData.isActive})}
              className={`px-4 py-2 rounded-full ${formData.isActive ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              <Text className={`font-medium ${formData.isActive ? 'text-green-800' : 'text-gray-600'}`}>
                {formData.isActive ? 'Active' : 'Paused'}
              </Text>
            </Pressable>
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={handleSave}
              className="flex-1 bg-black rounded-lg py-4"
            >
              <Text className="text-white text-center font-medium text-base">
                {isEditing ? 'Update Campaign' : 'Add Campaign'}
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => setShowForm(false)}
              className="flex-1 bg-gray-200 rounded-lg py-4"
            >
              <Text className="text-gray-700 text-center font-medium text-base">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between p-4">
        <Text className="text-lg font-bold text-gray-900">
          Campaigns ({campaigns.length})
        </Text>
        <Pressable
          onPress={handleAdd}
          className="bg-black rounded-lg px-4 py-2 flex-row items-center"
        >
          <Ionicons name="add" size={16} color="white" />
          <Text className="text-white font-medium ml-1">Add Campaign</Text>
        </Pressable>
      </View>

      <FlatList
        data={campaigns}
        renderItem={renderCampaign}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-16">
            <Ionicons name="megaphone-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              No campaigns yet
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Tap "Add Campaign" to get started
            </Text>
          </View>
        )}
      />
    </View>
  );
};