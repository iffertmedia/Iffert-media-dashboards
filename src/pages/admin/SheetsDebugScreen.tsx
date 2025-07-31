import React, { useState } from 'react';
// [converted from react-native] import { div, span, Scrolldiv, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchProductsFromSheets, fetchProductsWithFallback, getSheetDebugInfo, validateSheetStructure } from '../../services/googleSheets';
import { fetchCreatorsFromSheets, fetchCreatorsWithFallback, getCreatorsSheetDebugInfo, validateCreatorsSheetStructure } from '../../services/googleSheetsCreators';
import { fetchCampaignsFromSheets, fetchCampaignsWithFallback, getCampaignsSheetDebugInfo, validateCampaignsSheetStructure } from '../../services/googleSheetsCampaigns';
import { useProductStore } from '../../state/useProductStore';

interface DebugLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  data?: any;
}

export const SheetsDebugScreen: React.FC = () => {
  const { products, setProducts, creators, setCreators, campaigns, setCampaigns } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);
  const [rawSheetData, setRawSheetData] = useState<string>('');
  const [parsedData, setParsedData] = useState<any[]>([]);

  const addLog = (level: DebugLog['level'], message: string, data?: any) => {
    const log: DebugLog = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      data
    };
    setDebugLogs(prev => [log, ...prev]);
  };

  const clearLogs = () => {
    setDebugLogs([]);
    setRawSheetData('');
    setParsedData([]);
  };

  const testSheetConnection = async () => {
    setIsLoading(true);
    addLog('info', 'Testing Google Sheets connection...');

    try {
      const debugInfo = await getSheetDebugInfo();
      
      if (debugInfo.success) {
        addLog('success', `Connection successful - HTTP ${debugInfo.status}`);
        addLog('info', `Data received: ${debugInfo.dataLength} characters, ${debugInfo.totalRows} rows`);
        addLog('info', 'Headers detected', { headers: debugInfo.headers });
        
        if (debugInfo.sampleRow.length > 0) {
          addLog('info', 'Sample data row', { sampleRow: debugInfo.sampleRow });
        }
        
        setRawSheetData(`Headers: ${debugInfo.headers.join(', ')}\nSample Row: ${debugInfo.sampleRow.join(', ')}`);
        
        // Validate sheet structure
        const validation = await validateSheetStructure();
        if (validation.valid) {
          addLog('success', `Sheet structure is valid (${validation.totalRows} data rows)`);
        } else {
          addLog('warning', 'Sheet structure issues detected', { 
            issues: validation.issues,
            recommendations: validation.recommendations 
          });
        }
        
      } else {
        addLog('error', 'Connection failed', { error: debugInfo.error });
      }

    } catch (error) {
      addLog('error', 'Connection test failed', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testProductParsing = async () => {
    setIsLoading(true);
    addLog('info', 'Testing product parsing from sheets...');

    try {
      const products = await fetchProductsFromSheets();
      addLog('success', `Successfully parsed ${products.length} products`);
      
      if (products.length > 0) {
        addLog('info', 'Sample parsed product', products[0]);
        
        // Analyze parsing results
        const categories = [...new Set(products.map(p => p.category))];
        const tags = [...new Set(products.flatMap(p => p.tags))];
        const shops = [...new Set(products.map(p => p.shopName))];
        
        addLog('info', 'Analysis Results', {
          totalProducts: products.length,
          categories: categories,
          uniqueTags: tags,
          uniqueShops: shops.length
        });
      }

    } catch (error) {
      addLog('error', 'Product parsing failed', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const validateSheetStructureTest = async () => {
    setIsLoading(true);
    addLog('info', 'Validating Google Sheets structure...');

    try {
      const validation = await validateSheetStructure();
      
      if (validation.valid) {
        addLog('success', `Sheet structure is valid! Found ${validation.totalRows} data rows`);
        addLog('info', 'Available headers', { headers: validation.headers });
      } else {
        addLog('warning', 'Sheet structure issues found');
        validation.issues.forEach(issue => {
          addLog('error', issue);
        });
        validation.recommendations?.forEach(rec => {
          addLog('info', rec);
        });
      }
      
    } catch (error) {
      addLog('error', 'Structure validation failed', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testCreatorsConnection = async () => {
    setIsLoading(true);
    addLog('info', 'Testing Creators sheet connection...');

    try {
      const debugInfo = await getCreatorsSheetDebugInfo();
      
      if (debugInfo.success) {
        addLog('success', `Creators connection successful - HTTP ${debugInfo.status}`);
        addLog('info', `Data received: ${debugInfo.dataLength} characters, ${debugInfo.totalRows} rows`);
        addLog('info', 'Creators headers detected', { headers: debugInfo.headers });
        
        const validation = await validateCreatorsSheetStructure();
        if (validation.valid) {
          addLog('success', `Creators sheet structure is valid (${validation.totalRows} data rows)`);
        } else {
          addLog('warning', 'Creators sheet structure issues detected', { 
            issues: validation.issues,
            recommendations: validation.recommendations 
          });
        }
      } else {
        addLog('error', 'Creators connection failed', { error: debugInfo.error });
      }
    } catch (error) {
      addLog('error', 'Creators connection test failed', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testCampaignsConnection = async () => {
    console.log('📱 testCampaignsConnection function called');
    addLog('info', 'Function called - starting test');
    setIsLoading(true);
    
    try {
      addLog('info', 'Starting campaigns test...');
      console.log('🔄 Starting campaigns debug test...');
      
      // Step 1: Test basic connection
      addLog('info', 'Step 1: Testing Google Sheets connection...');
      const CAMPAIGNS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXwT5WKsZki1qfjygvnKvJhbJDNciveomj5PSYNJ_8ASHz9nx6uLdkANuGo9k29EzuV-kGKMTCmUqC/pub?output=csv';
      
      const response = await fetch(CAMPAIGNS_URL);
      addLog('info', `Connection status: ${response.status} ${response.statusspan}`);
      
      // Step 2: Get raw data
      const rawData = await response.text();
      addLog('info', `Raw data length: ${rawData.length} characters`);
      
      // Step 3: Parse CSV
      const lines = rawData.split('\n').filter(line => line.trim());
      addLog('info', `CSV lines: ${lines.length}`);
      
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        addLog('success', 'Headers found', { headers });
        
        // Look for banner and commission columns
        const bannerIndex = headers.findIndex(h => h.toLowerCase().includes('banner'));
        const commissionIndex = headers.findIndex(h => h.toLowerCase().includes('commission'));
        
        addLog('info', `Banner column index: ${bannerIndex}, Commission column index: ${commissionIndex}`);
        
        if (lines.length > 1) {
          const sampleRow = lines[1].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
          addLog('info', 'Sample data row', { sampleRow });
          
          if (bannerIndex >= 0 && sampleRow[bannerIndex]) {
            addLog('success', `Banner URL found: "${sampleRow[bannerIndex]}"`);
          }
          if (commissionIndex >= 0 && sampleRow[commissionIndex]) {
            addLog('success', `Commission found: "${sampleRow[commissionIndex]}"`);
          }
        }
      }
      
      // Step 4: Test campaign parsing
      addLog('info', 'Step 4: Testing campaign parsing...');
      const campaigns = await fetchCampaignsWithFallback();
      addLog('success', `Parsed ${campaigns.length} campaigns`);
      
      if (campaigns.length > 0) {
        campaigns.forEach((campaign, index) => {
          addLog('info', `Campaign ${index + 1}: ${campaign.title}`, {
            title: campaign.title,
            commission: campaign.totalCommission,
            bannerUrl: campaign.bannerUrl,
            bannerImage: campaign.bannerImage,
            isActive: campaign.isActive,
            id: campaign.id
          });
        });
      }
      
    } catch (error) {
      console.error('Campaign test error:', error);
      addLog('error', `Test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAllFromSheets = async () => {
    setIsLoading(true);
    addLog('info', 'Refreshing all data from Google Sheets...');

    try {
      // Refresh products
      const fetchedProducts = await fetchProductsWithFallback();
      setProducts(fetchedProducts);
      addLog('success', `Products updated: ${fetchedProducts.length} items`);

      // Refresh creators
      const fetchedCreators = await fetchCreatorsWithFallback();
      setCreators(fetchedCreators);
      addLog('success', `Creators updated: ${fetchedCreators.length} items`);

      // Refresh campaigns
      const fetchedCampaigns = await fetchCampaignsWithFallback();
      setCampaigns(fetchedCampaigns);
      addLog('success', `Campaigns updated: ${fetchedCampaigns.length} items`);

      Alert.alert('Success', `Loaded all data:\n• ${fetchedProducts.length} products\n• ${fetchedCreators.length} creators\n• ${fetchedCampaigns.length} campaigns`);
    } catch (error) {
      addLog('error', 'Failed to refresh all data', { error: error.message });
      Alert.alert('Error', 'Failed to refresh data from Google Sheets');
    } finally {
      setIsLoading(false);
    }
  };

  const getLogIcon = (level: DebugLog['level']) => {
    switch (level) {
      case 'success': return { name: 'checkmark-circle' as const, color: '#10b981' };
      case 'error': return { name: 'close-circle' as const, color: '#ef4444' };
      case 'warning': return { name: 'warning' as const, color: '#f59e0b' };
      default: return { name: 'information-circle' as const, color: '#6b7280' };
    }
  };

  const getLogBgColor = (level: DebugLog['level']) => {
    switch (level) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Scrolldiv className="flex-1 bg-gray-50" showsVerticalScrollIndicator={true}>
      {/* Header */}
      <div className="p-4">
        <span className="text-lg font-bold text-gray-900 mb-2">
          Google Sheets Debug
        </span>
        <span className="text-gray-600">
          Test and monitor the Google Sheets integration
        </span>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <span className="font-semibold text-gray-900 mb-3">Quick Actions</span>
          
          <div className="space-y-3">
            <Pressable
              onPress={testSheetConnection}
              disabled={isLoading}
              className="flex-row items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex-row items-center">
                <Ionicons name="cube" size={20} color="#3b82f6" />
                <span className="text-blue-700 font-medium ml-3">Test Products Sheet</span>
              </div>
              {isLoading && <ActivityIndicator size="small" color="#3b82f6" />}
            </Pressable>

            <Pressable
              onPress={testCreatorsConnection}
              disabled={isLoading}
              className="flex-row items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
            >
              <div className="flex-row items-center">
                <Ionicons name="people" size={20} color="#8b5cf6" />
                <span className="text-purple-700 font-medium ml-3">Test Creators Sheet</span>
              </div>
              {isLoading && <ActivityIndicator size="small" color="#8b5cf6" />}
            </Pressable>

            <Pressable
              onPress={() => {
                console.log('🚀 Test Campaigns Sheet button pressed');
                console.log('Current debugLogs length:', debugLogs.length);
                
                // Test logs immediately
                addLog('info', 'Button pressed - testing logs');
                addLog('success', 'Logs are working!');
                addLog('warning', 'This is a warning log');
                addLog('error', 'This is an error log');
                
                console.log('After adding logs, debugLogs length:', debugLogs.length);
                
                Alert.alert('Debug', `Added 4 test logs. Current count: ${debugLogs.length + 4}`);
                
                // Then run the actual test
                testCampaignsConnection();
              }}
              disabled={isLoading}
              className="flex-row items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
            >
              <div className="flex-row items-center">
                <Ionicons name="megaphone" size={20} color="#f97316" />
                <span className="text-orange-700 font-medium ml-3">Test Campaigns Sheet</span>
              </div>
              {isLoading && <ActivityIndicator size="small" color="#f97316" />}
            </Pressable>

            <Pressable
              onPress={refreshAllFromSheets}
              disabled={isLoading}
              className="flex-row items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="flex-row items-center">
                <Ionicons name="refresh" size={20} color="#10b981" />
                <span className="text-green-700 font-medium ml-3">Refresh All Data</span>
              </div>
              {isLoading && <ActivityIndicator size="small" color="#10b981" />}
            </Pressable>

            <Pressable
              onPress={clearLogs}
              className="flex-row items-center justify-center p-3 bg-gray-100 rounded-lg"
            >
              <Ionicons name="trash" size={20} color="#6b7280" />
              <span className="text-gray-700 font-medium ml-2">Clear Logs</span>
            </Pressable>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <span className="font-semibold text-gray-900 mb-3">Current Status</span>
          
          <div className="space-y-2">
            <div className="flex-row justify-between">
              <span className="text-gray-600">Products in Store:</span>
              <span className="font-medium text-gray-900">{products.length}</span>
            </div>
            <div className="flex-row justify-between">
              <span className="text-gray-600">Creators in Store:</span>
              <span className="font-medium text-gray-900">{creators.length}</span>
            </div>
            <div className="flex-row justify-between">
              <span className="text-gray-600">Campaigns in Store:</span>
              <span className="font-medium text-gray-900">{campaigns.length}</span>
            </div>
            <div className="flex-row justify-between">
              <span className="text-gray-600">Last Debug Data:</span>
              <span className="font-medium text-gray-900">{rawSheetData ? 'Available' : 'None'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Logs */}
      <div className="px-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <span className="font-semibold text-gray-900">Debug Logs ({debugLogs.length})</span>
          </div>
          
          <div className="p-4">
            {debugLogs.length === 0 ? (
              <div className="items-center justify-center py-8">
                <Ionicons name="bug" size={48} color="#d1d5db" />
                <span className="text-gray-500 mt-2">No debug logs yet</span>
                <span className="text-gray-400 text-sm">Run a test to see logs here</span>
              </div>
            ) : (
              debugLogs.map((log, index) => {
                const icon = getLogIcon(log.level);
                return (
                  <div key={index} className={`rounded-lg border p-3 mb-3 ${getLogBgColor(log.level)}`}>
                    <div className="flex-row items-start">
                      <Ionicons name={icon.name} size={16} color={icon.color} />
                      <div className="flex-1 ml-3">
                        <div className="flex-row items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {log.message}
                          </span>
                          <span className="text-xs text-gray-500">
                            {log.timestamp}
                          </span>
                        </div>
                        {log.data && (
                          <div className="bg-gray-800 rounded p-2 mt-2">
                            <span className="text-xs text-green-400 font-mono">
                              {JSON.stringify(log.data, null, 2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Scrolldiv>
  );
};