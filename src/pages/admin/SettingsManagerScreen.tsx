import React, { useState } from 'react';
// [converted from react-native] import { div, span, Pressable, Scrolldiv, Alert, spanInput } from 'react-native';
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
    <Scrolldiv className="flex-1 bg-gray-50 p-4">
      {/* App Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <span className="text-lg font-bold text-gray-900 mb-4">App Settings</span>
        
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700 mb-2">Company Name</span>
          <spanInput
            value={companyName}
            onChangespan={setCompanyName}
            className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
            placeholder="Enter company name"
          />
        </div>

        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700 mb-2">Discord Server URL</span>
          <spanInput
            value={discordUrl}
            onChangespan={setDiscordUrl}
            className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
            placeholder="https://discord.gg/..."
            keyboardType="url"
            autoCapitalize="none"
          />
        </div>

        <Pressable
          onPress={() => Alert.alert('Settings Saved', 'App settings have been updated')}
          className="bg-black rounded-lg py-3"
        >
          <span className="text-white text-center font-medium">Save Settings</span>
        </Pressable>
      </div>

      {/* Data Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <span className="text-lg font-bold text-gray-900 mb-4">Data Overview</span>
        
        <div className="space-y-3">
          <div className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">Total Products</span>
            <span className="font-semibold text-gray-900">{stats.totalProducts}</span>
          </div>
          
          <div className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">Total Campaigns</span>
            <div className="flex-row items-center">
              <span className="font-semibold text-gray-900 mr-2">{stats.totalCampaigns}</span>
              <div className="bg-green-100 px-2 py-1 rounded-full">
                <span className="text-green-800 text-xs font-medium">{stats.activeCampaigns} active</span>
              </div>
            </div>
          </div>
          
          <div className="flex-row justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700">Total Creators</span>
            <div className="flex-row items-center">
              <span className="font-semibold text-gray-900 mr-2">{stats.totalCreators}</span>
              <div className="bg-blue-100 px-2 py-1 rounded-full">
                <span className="text-blue-800 text-xs font-medium">{stats.verifiedCreators} verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <span className="text-lg font-bold text-gray-900 mb-4">Data Management</span>
        
        <div className="space-y-3">
          <Pressable
            onPress={handleExportData}
            className="flex-row items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex-row items-center">
              <Ionicons name="download" size={20} color="#3b82f6" />
              <span className="text-blue-700 font-medium ml-3">Export All Data</span>
            </div>
            <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
          </Pressable>
          
          <Pressable
            onPress={handleImportData}
            className="flex-row items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <div className="flex-row items-center">
              <Ionicons name="cloud-upload" size={20} color="#10b981" />
              <span className="text-green-700 font-medium ml-3">Import Data</span>
            </div>
            <Ionicons name="chevron-forward" size={16} color="#10b981" />
          </Pressable>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 mb-6">
        <span className="text-lg font-bold text-red-900 mb-2">Danger Zone</span>
        <span className="text-sm text-red-600 mb-4">
          These actions are permanent and cannot be undone
        </span>
        
        <Pressable
          onPress={handleClearAllData}
          className="flex-row items-center justify-center p-3 bg-red-50 rounded-lg border border-red-200"
        >
          <Ionicons name="trash" size={20} color="#dc2626" />
          <span className="text-red-700 font-medium ml-2">Clear All Data</span>
        </Pressable>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <span className="text-lg font-bold text-gray-900 mb-4">App Information</span>
        
        <div className="space-y-2">
          <div className="flex-row justify-between">
            <span className="text-gray-600">Version</span>
            <span className="text-gray-900">1.0.0</span>
          </div>
          <div className="flex-row justify-between">
            <span className="text-gray-600">Platform</span>
            <span className="text-gray-900">React Native</span>
          </div>
          <div className="flex-row justify-between">
            <span className="text-gray-600">Build</span>
            <span className="text-gray-900">Development</span>
          </div>
        </div>
      </div>
    </Scrolldiv>
  );
};