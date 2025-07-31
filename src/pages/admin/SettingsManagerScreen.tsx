import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../../state/useProductStore';

export const SettingsManagerScreen: React.FC = () => {
  const { products, campaigns, creators, setProducts, setCampaigns, setCreators } = useProductStore();
  const [discordUrl, setDiscordUrl] = useState('https://discord.gg/iffertmedia');
  const [companyName, setCompanyName] = useState('Iffert Media');

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all products, campaigns, and creators. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setProducts([]);
            setCampaigns([]);
            setCreators([]);
            Alert.alert('Success', 'All data has been cleared');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    const exportData = {
      products,
      campaigns,
      creators,
      settings: {
        discordUrl,
        companyName
      },
      exportDate: new Date().toISOString()
    };
    
    // In a real app, this would save to file or cloud storage
    console.log('Export Data:', JSON.stringify(exportData, null, 2));
    Alert.alert('Export Complete', 'Data has been exported to console logs');
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'This feature would allow you to import data from a JSON file. For now, you can manually add content through the admin panels.',
      [{ text: 'OK' }]
    );
  };

  const getDataStats = () => {
    return {
      totalProducts: products.length,
      activeProducts: products.length,
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.isActive).length,
      totalCreators: creators.length,
      verifiedCreators: creators.filter(c => c.isVerified).length
    };
  };

  const stats = getDataStats();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* App Settings */}
      <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <Text className="text-lg font-bold text-gray-900 mb-4">App Settings</Text>
        
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Company Name</Text>
          <TextInput
            value={companyName}
            onChangeText={setCompanyName}
            className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
            placeholder="Enter company name"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Discord Server URL</Text>
          <TextInput
            value={discordUrl}
            onChangeText={setDiscordUrl}
            className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
            placeholder="https://discord.gg/..."
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <Pressable
          onPress={() => Alert.alert('Settings Saved', 'App settings have been updated')}
          className="bg-black rounded-lg py-3"
        >
          <Text className="text-white text-center font-medium">Save Settings</Text>
        </Pressable>
      </View>

      {/* Data Statistics */}
      <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <Text className="text-lg font-bold text-gray-900 mb-4">Data Overview</Text>
        
        <View className="space-y-3">
          <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <Text className="text-gray-700">Total Products</Text>
            <Text className="font-semibold text-gray-900">{stats.totalProducts}</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <Text className="text-gray-700">Total Campaigns</Text>
            <View className="flex-row items-center">
              <Text className="font-semibold text-gray-900 mr-2">{stats.totalCampaigns}</Text>
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-green-800 text-xs font-medium">{stats.activeCampaigns} active</Text>
              </View>
            </View>
          </View>
          
          <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <Text className="text-gray-700">Total Creators</Text>
            <View className="flex-row items-center">
              <Text className="font-semibold text-gray-900 mr-2">{stats.totalCreators}</Text>
              <View className="bg-blue-100 px-2 py-1 rounded-full">
                <Text className="text-blue-800 text-xs font-medium">{stats.verifiedCreators} verified</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <Text className="text-lg font-bold text-gray-900 mb-4">Data Management</Text>
        
        <View className="space-y-3">
          <Pressable
            onPress={handleExportData}
            className="flex-row items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <View className="flex-row items-center">
              <Ionicons name="download" size={20} color="#3b82f6" />
              <Text className="text-blue-700 font-medium ml-3">Export All Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
          </Pressable>
          
          <Pressable
            onPress={handleImportData}
            className="flex-row items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <View className="flex-row items-center">
              <Ionicons name="cloud-upload" size={20} color="#10b981" />
              <Text className="text-green-700 font-medium ml-3">Import Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#10b981" />
          </Pressable>
        </View>
      </View>

      {/* Danger Zone */}
      <View className="bg-white rounded-xl shadow-sm border border-red-200 p-4 mb-6">
        <Text className="text-lg font-bold text-red-900 mb-2">Danger Zone</Text>
        <Text className="text-sm text-red-600 mb-4">
          These actions are permanent and cannot be undone
        </Text>
        
        <Pressable
          onPress={handleClearAllData}
          className="flex-row items-center justify-center p-3 bg-red-50 rounded-lg border border-red-200"
        >
          <Ionicons name="trash" size={20} color="#dc2626" />
          <Text className="text-red-700 font-medium ml-2">Clear All Data</Text>
        </Pressable>
      </View>

      {/* App Info */}
      <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <Text className="text-lg font-bold text-gray-900 mb-4">App Information</Text>
        
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Version</Text>
            <Text className="text-gray-900">1.0.0</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Platform</Text>
            <Text className="text-gray-900">React Native</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Build</Text>
            <Text className="text-gray-900">Development</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};