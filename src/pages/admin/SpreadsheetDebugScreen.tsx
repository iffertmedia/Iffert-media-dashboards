import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { debugCSVStructure, fetchCampaignsFromSpreadsheet } from '../../services/campaignDataService';
import { useProductStore } from '../../state/useProductStore';

export const SpreadsheetDebugScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { loadCampaignsFromSpreadsheet } = useProductStore();

  const handleDebugCSV = async () => {
    setIsLoading(true);
    setDebugInfo('');
    
    try {
      console.log('=== CSV DEBUG START ===');
      await debugCSVStructure();
      
      const campaigns = await fetchCampaignsFromSpreadsheet();
      const info = `
CSV Debug Results:
- Found ${campaigns.length} campaigns
- Check console for detailed structure
- First campaign: ${campaigns[0]?.title || 'None'}

Campaigns loaded:
${campaigns.map((c, i) => `${i+1}. ${c.title} (${c.sellerName})`).join('\n')}
      `.trim();
      
      setDebugInfo(info);
      console.log('=== CSV DEBUG END ===');
      
    } catch (error) {
      const errorInfo = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setDebugInfo(errorInfo);
      console.error('CSV Debug Error:', error);
    }
    
    setIsLoading(false);
  };

  const handleLoadCampaigns = async () => {
    try {
      await loadCampaignsFromSpreadsheet();
      Alert.alert('Success', 'Campaigns loaded from spreadsheet successfully!');
    } catch (error) {
      Alert.alert('Error', `Failed to load campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <Text className="text-lg font-bold text-gray-900 mb-4">
          Spreadsheet Integration Debug
        </Text>
        
        <Text className="text-sm text-gray-600 mb-4">
          Use these tools to debug the Google Sheets CSV integration and see what data is being loaded.
        </Text>

        <View className="space-y-3">
          <Pressable
            onPress={handleDebugCSV}
            disabled={isLoading}
            className="flex-row items-center justify-center p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <Ionicons name="bug" size={20} color="#3b82f6" />
            <Text className="text-blue-700 font-medium ml-2">
              {isLoading ? 'Debugging...' : 'Debug CSV Structure'}
            </Text>
          </Pressable>
          
          <Pressable
            onPress={handleLoadCampaigns}
            className="flex-row items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <Ionicons name="download" size={20} color="#10b981" />
            <Text className="text-green-700 font-medium ml-2">
              Load Campaigns from Spreadsheet
            </Text>
          </Pressable>
        </View>
      </View>

      {debugInfo && (
        <View className="bg-gray-900 rounded-xl p-4">
          <Text className="text-green-400 font-mono text-xs">
            {debugInfo}
          </Text>
        </View>
      )}

      <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="information-circle" size={16} color="#d97706" />
          <Text className="text-yellow-800 font-medium ml-2">CSV Format Guide</Text>
        </View>
        <Text className="text-yellow-700 text-sm">
          Your spreadsheet should have columns like:{'\n'}
          • Campaign Title or Title{'\n'}
          • Seller Name or Seller{'\n'}
          • Description or Campaign Description{'\n'}
          • Category or Product Category{'\n'}
          • Commission or Commission Rate{'\n'}
          • Status or Active{'\n'}
          • Start Date, End Date{'\n'}
          • Banner Image, Seller Logo (optional)
        </Text>
      </View>
    </ScrollView>
  );
};