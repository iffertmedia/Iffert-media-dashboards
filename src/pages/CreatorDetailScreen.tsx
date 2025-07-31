import React from 'react';
import { View, Text, ScrollView, Image, Dimensions, Pressable, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Creator } from '../types/product';

interface CreatorDetailScreenProps {
  route: {
    params: {
      creator: Creator;
    };
  };
  navigation: any;
}

export const CreatorDetailScreen: React.FC<CreatorDetailScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const { creator } = route.params;
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = Dimensions.get('window');

  const handleRequestCollab = async () => {
    const subject = `Collaboration Request - ${creator.name} (${creator.tiktokHandle})`;
    const body = `Hi Iffert Media,\n\nI would like to request a collaboration with ${creator.name} (${creator.tiktokHandle}).\n\nPlease let me know the next steps.\n\nThank you!`;
    const emailUrl = `mailto:hello@iffertmedia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert(
          'Email Not Available',
          'Please contact us at hello@iffertmedia.com to request a collaboration.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Contact Us',
        'Please reach out to hello@iffertmedia.com to request a collaboration.',
        [{ text: 'OK' }]
      );
    }
  };



  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  // GMV is now a string from spreadsheet, no formatting needed

  const generateInlineVideoHTML = (embedCode: string) => {
    console.log('🎥 Full embed code received:', embedCode);
    
    // Extract video ID from TikTok embed code or URL
    let videoId = null;
    let username = null;
    
    // Try to extract from blockquote cite attribute
    if (embedCode.includes('blockquote')) {
      const citeMatch = embedCode.match(/cite="https:\/\/www\.tiktok\.com\/@([^\/]+)\/video\/(\d+)"/);
      if (citeMatch) {
        username = citeMatch[1];
        videoId = citeMatch[2];
      }
    }
    
    // Try to extract from regular TikTok URL
    if (!videoId && embedCode.includes('tiktok.com/')) {
      const urlMatch = embedCode.match(/tiktok\.com\/@([^\/]+)\/video\/(\d+)/);
      if (urlMatch) {
        username = urlMatch[1];
        videoId = urlMatch[2];
      }
    }
    
    console.log('🎥 Extracted username:', username, 'videoId:', videoId);
    
    // If we have a video ID, create direct iframe embed
    if (videoId) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              html, body {
                width: 100%;
                height: 100%;
                background: #000;
                overflow: hidden;
              }
              body {
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .embed-container {
                width: 100%;
                max-width: 350px;
                height: 550px;
                background: #000;
                border-radius: 12px;
                overflow: hidden;
                position: relative;
              }
              iframe {
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 12px;
                background: #000;
              }
              .loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="embed-container">
              <div class="loading">Loading TikTok video...</div>
              <iframe 
                src="https://www.tiktok.com/embed/v2/${videoId}?lang=en" 
                allowfullscreen 
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                onload="document.querySelector('.loading').style.display='none'"
                onerror="document.querySelector('.loading').innerHTML='Video unavailable'"
              ></iframe>
            </div>
          </body>
        </html>
      `;
    }
    
    // Fallback - try original embed code but simplified
    if (embedCode.includes('<blockquote') || embedCode.includes('<iframe')) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              html, body {
                width: 100%;
                height: 100%;
                background: #f0f0f0;
                overflow: hidden;
              }
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              }
              .embed-container {
                width: 100%;
                max-width: 350px;
                height: 550px;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 20px;
              }
              .error-message {
                color: #666;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="embed-container">
              <div class="error-message">
                <p>TikTok video embed</p>
                <p style="font-size: 12px; margin-top: 10px;">Video may not be supported in this view</p>
              </div>
            </div>
          </body>
        </html>
      `;
    }
    
    // Final fallback for any other content
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              background: #f0f0f0;
              overflow: hidden;
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .embed-container {
              width: 100%;
              max-width: 350px;
              height: 550px;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 20px;
            }
            .error-message {
              color: #666;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="embed-container">
            <div class="error-message">
              <p>Video format not supported</p>
              <p style="font-size: 12px; margin-top: 10px; word-break: break-all;">${embedCode.substring(0, 50)}...</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };



  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
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
        
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">
            Creator Details
          </Text>
          <Text className="text-sm text-gray-600">
            {creator.tiktokHandle}
          </Text>
        </View>
        
        <Pressable 
          onPress={handleRequestCollab}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold text-sm">
            Request Collab
          </Text>
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Creator Info Card */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Creator Header */}
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: creator.avatar }}
              className="w-20 h-20 rounded-full mr-4"
            />
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-xl font-bold text-gray-900">
                  {creator.name}
                </Text>
                {creator.isVerified && (
                  <Ionicons name="checkmark-circle" size={20} color="#0ea5e9" className="ml-2" />
                )}
              </View>
              <Text className="text-gray-600 mb-2">
                {creator.tiktokHandle}
              </Text>
              <Text className="text-sm text-gray-500">
                {creator.niche.join(' • ')}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between bg-gray-50 rounded-lg p-4 mb-4">            
            <View className="items-center flex-1">
              <Text className="text-base font-bold text-gray-900 text-center">
                {creator.category}
              </Text>
              <Text className="text-sm text-gray-600">CATEGORY</Text>
            </View>
            
            <View className="w-px bg-gray-300" />
            
            <View className="items-center flex-1">
              <Text className="text-xl font-bold text-gray-900">
                {creator.followers}
              </Text>
              <Text className="text-sm text-gray-600">Followers</Text>
            </View>
            
            <View className="w-px bg-gray-300" />
            
            <View className="items-center flex-1">
              <Text className="text-xl font-bold text-gray-900">
                {creator.gmv}
              </Text>
              <Text className="text-sm text-gray-600">GMV</Text>
            </View>
          </View>

          {/* Collab Options */}
          <View className="bg-green-50 rounded-lg p-3 mt-4">
            <View className="flex-row justify-center items-center">
              {(creator.collabOptions?.freeSample !== false) && (
                <View className="flex-row items-center mr-3">
                  <Text className="text-green-600 mr-1">✅</Text>
                  <Text className="text-green-800 font-medium text-xs">FREE SAMPLE</Text>
                </View>
              )}
              {(creator.collabOptions?.paidCollab !== false) && (
                <View className="flex-row items-center mr-3">
                  <Text className="text-green-600 mr-1">✅</Text>
                  <Text className="text-green-800 font-medium text-xs">PAID COLLAB</Text>
                </View>
              )}
              {(creator.collabOptions?.retainer !== false) && (
                <View className="flex-row items-center">
                  <Text className="text-green-600 mr-1">✅</Text>
                  <Text className="text-green-800 font-medium text-xs">RETAINER</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Example Videos Section */}
        {creator.exampleVideos && creator.exampleVideos.length > 0 && (
          <View className="mt-6">
            <Text className="text-xl font-bold text-gray-900 px-4 mb-4">
              Example Videos
            </Text>
            
            {creator.exampleVideos.map((video, index) => (
              <View key={video.id} className="mx-4 mb-6">
                <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <WebView
                    source={{ html: generateInlineVideoHTML(video.url) }}
                    style={{ 
                      width: screenWidth - 32, 
                      height: 580,
                      backgroundColor: '#000',
                      borderRadius: 12
                    }}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    mixedContentMode="compatibility"
                    originWhitelist={['*']}
                    allowsFullscreenVideo={true}
                    onLoadStart={() => console.log(`🎥 WebView ${index + 1} loading started`)}
                    onLoadEnd={() => console.log(`🎥 WebView ${index + 1} loading finished`)}
                    onError={(error) => {
                      console.error(`🎥 Video ${index + 1} embed error:`, error);
                    }}
                    onMessage={(event) => {
                      console.log(`🎥 WebView ${index + 1} message:`, event.nativeEvent.data);
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Request Collab Button */}
        <View className="mx-4 mt-8 mb-4">
          <Pressable 
            onPress={handleRequestCollab}
            className="bg-blue-600 py-4 rounded-xl items-center shadow-sm"
          >
            <Text className="text-white font-bold text-lg">
              Request Collab
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};