import React, { useState } from 'react';
// [converted from react-native] import { div, span, Scrolldiv, Pressable, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../../state/useProductStore';
import { Creator, ExampleVideo } from '../../types/product';
import { FormField, SelectField, TagInput, ImageInput } from '../../components/admin/FormComponents';

export const CreatorManagerScreen: React.FC = () => {
  const { creators, setCreators } = useProductStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Creator>>({
    name: '',
    avatar: '',
    followers: '',
    engagement: 4.0,
    gmv: 0,
    niche: [],
    tiktokHandle: '',
    isVerified: false,
    tier: 'B',
    category: '',
    exampleVideos: []
  });

  const tierOptions = [
    { label: 'S Tier (Top Performers)', value: 'S' },
    { label: 'A Tier (High Performers)', value: 'A' },
    { label: 'B Tier (Good Performers)', value: 'B' },
    { label: 'C Tier (New/Developing)', value: 'C' }
  ];

  const availableNiches = [
    'beauty', 'fashion', 'tech', 'gaming', 'fitness', 'health', 
    'lifestyle', 'food', 'travel', 'comedy', 'dance', 'music'
  ];

  const handleEdit = (creator: Creator) => {
    setEditingCreator(creator);
    setFormData(creator);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingCreator(null);
    setFormData({
      name: '',
      avatar: '',
      followers: '',
      engagement: 4.0,
      gmv: 0,
      niche: [],
      tiktokHandle: '',
      isVerified: false,
      tier: 'B',
      category: '',
      exampleVideos: []
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.tiktokHandle || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const creatorData: Creator = {
      id: editingCreator?.id || Date.now().toString(),
      name: formData.name!,
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      followers: formData.followers!,
      engagement: formData.engagement!,
      gmv: formData.gmv!,
      niche: formData.niche!,
      tiktokHandle: formData.tiktokHandle!,
      isVerified: formData.isVerified!,
      tier: formData.tier as 'S' | 'A' | 'B' | 'C',
      category: formData.category!,
      exampleVideos: formData.exampleVideos
    };

    if (isEditing) {
      const updatedCreators = creators.map(c => c.id === editingCreator?.id ? creatorData : c);
      setCreators(updatedCreators);
    } else {
      setCreators([...creators, creatorData]);
    }

    setShowForm(false);
    Alert.alert('Success', `Creator ${isEditing ? 'updated' : 'added'} successfully`);
  };

  const handleDelete = (creator: Creator) => {
    Alert.alert(
      'Delete Creator',
      `Are you sure you want to delete "${creator.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedCreators = creators.filter(c => c.id !== creator.id);
            setCreators(updatedCreators);
          }
        }
      ]
    );
  };

  const addExampleVideo = () => {
    const newVideo: ExampleVideo = {
      id: Date.now().toString(),
      title: '',
      thumbnail: '',
      views: 0,
      likes: 0,
      url: ''
    };
    setFormData({
      ...formData,
      exampleVideos: [...(formData.exampleVideos || []), newVideo]
    });
  };

  const updateExampleVideo = (index: number, field: keyof ExampleVideo, value: string | number) => {
    const updatedVideos = [...(formData.exampleVideos || [])];
    updatedVideos[index] = { ...updatedVideos[index], [field]: value };
    setFormData({ ...formData, exampleVideos: updatedVideos });
  };

  const removeExampleVideo = (index: number) => {
    const updatedVideos = (formData.exampleVideos || []).filter((_, i) => i !== index);
    setFormData({ ...formData, exampleVideos: updatedVideos });
  };



  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-yellow-100 text-yellow-800';
      case 'A': return 'bg-gray-100 text-gray-800';
      case 'B': return 'bg-orange-100 text-orange-800';
      case 'C': return 'bg-gray-50 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCreator = ({ item }: { item: Creator }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      <div className="flex-row items-center justify-between mb-2">
        <div className="flex-row items-center flex-1">
          <div className={`w-6 h-6 rounded-full items-center justify-center mr-2 ${getTierColor(item.tier)}`}>
            <span className="text-xs font-bold">{item.tier}</span>
          </div>
          <span className="font-semibold text-gray-900 flex-1" numberOfLines={1}>
            {item.name}
          </span>
        </div>
        <div className="flex-row ml-2">
          <Pressable onPress={() => handleEdit(item)} className="p-2">
            <Ionicons name="pencil" size={16} color="#6b7280" />
          </Pressable>
          <Pressable onPress={() => handleDelete(item)} className="p-2">
            <Ionicons name="trash" size={16} color="#ef4444" />
          </Pressable>
        </div>
      </div>
      
      <span className="text-sm text-gray-600 mb-1">{item.tiktokHandle}</span>
      <span className="text-sm text-gray-600 mb-2">{item.category} • {item.niche.join(', ')}</span>
      
      <div className="flex-row items-center justify-between">
        <span className="text-sm font-medium text-gray-900">
          {item.followers} followers
        </span>
        <div className="flex-row items-center">
          {item.isVerified && (
            <Ionicons name="checkmark-circle" size={16} color="#0ea5e9" className="mr-2" />
          )}
          <span className="text-sm text-gray-600">{item.engagement}% engagement</span>
        </div>
      </div>
    </div>
  );

  if (showForm) {
    return (
      <Scrolldiv className="flex-1 bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex-row items-center justify-between mb-4">
            <span className="text-lg font-bold text-gray-900">
              {isEditing ? 'Edit Creator' : 'Add New Creator'}
            </span>
            <Pressable onPress={() => setShowForm(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </Pressable>
          </div>

          <FormField
            label="Creator Name"
            value={formData.name || ''}
            onChangespan={(text) => setFormData({...formData, name: text})}
            placeholder="Enter creator name"
            required
          />

          <FormField
            label="TikTok Handle"
            value={formData.tiktokHandle || ''}
            onChangespan={(text) => setFormData({...formData, tiktokHandle: text})}
            placeholder="@username"
            required
          />

          <FormField
            label="Category"
            value={formData.category || ''}
            onChangespan={(text) => setFormData({...formData, category: text})}
            placeholder="e.g., Beauty, Tech, Fashion"
            required
          />

          <SelectField
            label="Creator Tier"
            value={formData.tier || 'B'}
            options={tierOptions}
            onSelect={(value) => setFormData({...formData, tier: value as 'S' | 'A' | 'B' | 'C'})}
            required
          />

          <ImageInput
            label="Avatar Image"
            urls={formData.avatar ? [formData.avatar] : []}
            onUrlsChange={(urls) => setFormData({...formData, avatar: urls[0] || ''})}
            maxImages={1}
          />

          <div className="flex-row space-x-4 mb-4">
            <div className="flex-1">
              <FormField
                label="Followers"
                value={formData.followers || ''}
                onChangespan={(text) => setFormData({...formData, followers: text})}
                placeholder="850K"
              />
            </div>
            <div className="flex-1">
              <FormField
                label="Engagement Rate %"
                value={formData.engagement?.toString() || ''}
                onChangespan={(text) => setFormData({...formData, engagement: parseFloat(text) || 0})}
                placeholder="4.2"
                keyboardType="numeric"
              />
            </div>
          </div>

          <FormField
            label="GMV (Gross Merchandise Value)"
            value={formData.gmv?.toString() || ''}
            onChangespan={(text) => setFormData({...formData, gmv: parseInt(text) || 0})}
            placeholder="125000"
            keyboardType="numeric"
          />

          <TagInput
            label="Niche Tags"
            tags={formData.niche || []}
            onTagsChange={(tags) => setFormData({...formData, niche: tags})}
            availableTags={availableNiches}
            placeholder="Add niche..."
          />

          {/* Verification Toggle */}
          <div className="flex-row items-center justify-between mb-6">
            <span className="text-sm font-medium text-gray-700">Verified Creator</span>
            <Pressable
              onPress={() => setFormData({...formData, isVerified: !formData.isVerified})}
              className={`px-4 py-2 rounded-full ${formData.isVerified ? 'bg-blue-100' : 'bg-gray-100'}`}
            >
              <span className={`font-medium ${formData.isVerified ? 'text-blue-800' : 'text-gray-600'}`}>
                {formData.isVerified ? 'Verified' : 'Not Verified'}
              </span>
            </Pressable>
          </div>

          {/* Example Videos Section */}
          <span className="text-lg font-bold text-gray-900 mb-4">Example Videos</span>
          
          {(formData.exampleVideos || []).map((video, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex-row items-center justify-between mb-3">
                <span className="font-medium text-gray-900">Video {index + 1}</span>
                <Pressable onPress={() => removeExampleVideo(index)}>
                  <Ionicons name="trash" size={16} color="#ef4444" />
                </Pressable>
              </div>

              <FormField
                label="Video Title"
                value={video.title}
                onChangespan={(text) => updateExampleVideo(index, 'title', text)}
                placeholder="Enter video title"
              />

              <FormField
                label="Thumbnail URL"
                value={video.thumbnail}
                onChangespan={(text) => updateExampleVideo(index, 'thumbnail', text)}
                placeholder="https://..."
                keyboardType="url"
              />

              <FormField
                label="TikTok Video URL"
                value={video.url}
                onChangespan={(text) => updateExampleVideo(index, 'url', text)}
                placeholder="https://tiktok.com/@username/video..."
                keyboardType="url"
              />

              <div className="flex-row space-x-4">
                <div className="flex-1">
                  <FormField
                    label="divs"
                    value={video.views.toString()}
                    onChangespan={(text) => updateExampleVideo(index, 'views', parseInt(text) || 0)}
                    placeholder="1000000"
                    keyboardType="numeric"
                  />
                </div>
                <div className="flex-1">
                  <FormField
                    label="Likes"
                    value={video.likes.toString()}
                    onChangespan={(text) => updateExampleVideo(index, 'likes', parseInt(text) || 0)}
                    placeholder="50000"
                    keyboardType="numeric"
                  />
                </div>
              </div>
            </div>
          ))}

          <Pressable
            onPress={addExampleVideo}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 items-center mb-6"
          >
            <Ionicons name="add-circle-outline" size={24} color="#6b7280" />
            <span className="text-gray-500 font-medium mt-1">Add Example Video</span>
          </Pressable>

          <div className="flex-row gap-3">
            <Pressable
              onPress={handleSave}
              className="flex-1 bg-black rounded-lg py-4"
            >
              <span className="text-white text-center font-medium text-base">
                {isEditing ? 'Update Creator' : 'Add Creator'}
              </span>
            </Pressable>
            
            <Pressable
              onPress={() => setShowForm(false)}
              className="flex-1 bg-gray-200 rounded-lg py-4"
            >
              <span className="text-gray-700 text-center font-medium text-base">
                Cancel
              </span>
            </Pressable>
          </div>
        </div>
      </Scrolldiv>
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="flex-row items-center justify-between p-4">
        <span className="text-lg font-bold text-gray-900">
          Creators ({creators.length})
        </span>
        <Pressable
          onPress={handleAdd}
          className="bg-black rounded-lg px-4 py-2 flex-row items-center"
        >
          <Ionicons name="add" size={16} color="white" />
          <span className="text-white font-medium ml-1">Add Creator</span>
        </Pressable>
      </div>

      <FlatList
        data={creators}
        renderItem={renderCreator}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <div className="items-center justify-center py-16">
            <Ionicons name="people-outline" size={48} color="#d1d5db" />
            <span className="text-gray-500 text-lg font-medium mt-4">
              No creators yet
            </span>
            <span className="text-gray-400 text-center mt-2">
              Tap "Add Creator" to get started
            </span>
          </div>
        )}
      />
    </div>
  );
};