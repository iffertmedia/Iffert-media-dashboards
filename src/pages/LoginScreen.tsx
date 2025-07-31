import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../state/useAuthStore';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
      clearError();
    }
  }, [error, clearError]);

  const handleLogin = async () => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    const success = await login(credentials);
    if (success) {
      // Navigation will be handled automatically by the auth guard
      navigation.goBack();
    }
  };

  const handleDemoCredentials = () => {
    setCredentials({
      username: 'admin',
      password: 'iffert2024'
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View 
        className="bg-white px-4 pb-6 border-b border-gray-100 flex-row items-center"
        style={{ paddingTop: insets.top + 16 }}
      >
        <Pressable 
          onPress={() => navigation.goBack()}
          className="mr-4 p-2 -ml-2"
          disabled={isLoading}
        >
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </Pressable>
        
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">
            Admin Login
          </Text>
          <Text className="text-sm text-gray-600">
            Access restricted to administrators only
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-4">
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
          {/* Logo/Icon */}
          <View className="bg-black rounded-full p-4 items-center justify-center mb-6 self-center">
            <Ionicons name="shield-checkmark" size={32} color="white" />
          </View>

          <Text className="text-xl font-bold text-gray-900 text-center mb-2">
            Admin Access
          </Text>
          
          <Text className="text-gray-600 text-center mb-6">
            Sign in to manage app content and settings
          </Text>

          {/* Username Field */}
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Username
          </Text>
          <TextInput
            value={credentials.username}
            onChangeText={(text) => setCredentials({...credentials, username: text})}
            placeholder="Enter username"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white mb-4"
            placeholderTextColor="#9ca3af"
          />

          {/* Password Field */}
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Password
          </Text>
          <View className="relative mb-6">
            <TextInput
              value={credentials.password}
              onChangeText={(text) => setCredentials({...credentials, password: text})}
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              className="border border-gray-300 rounded-lg px-3 py-3 pr-12 text-base bg-white"
              placeholderTextColor="#9ca3af"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
              disabled={isLoading}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color="#6b7280" 
              />
            </Pressable>
          </View>

          {/* Login Button */}
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className={`rounded-lg py-4 flex-row items-center justify-center ${
              isLoading ? 'bg-gray-400' : 'bg-black'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="log-in" size={20} color="white" />
                <Text className="text-white font-medium text-base ml-2">
                  Sign In
                </Text>
              </>
            )}
          </Pressable>

          {/* Demo Credentials Helper */}
          <View className="mt-6 pt-6 border-t border-gray-200">
            <Text className="text-xs text-gray-500 text-center mb-3">
              Demo Credentials (for testing):
            </Text>
            <Pressable
              onPress={handleDemoCredentials}
              disabled={isLoading}
              className="bg-gray-100 rounded-lg p-3"
            >
              <Text className="text-gray-700 text-center text-sm">
                Username: admin
              </Text>
              <Text className="text-gray-700 text-center text-sm">
                Password: iffert2024
              </Text>
              <Text className="text-blue-600 text-center text-xs mt-1">
                Tap to auto-fill
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Security Note */}
        <View className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-4">
          <View className="flex-row items-center">
            <Ionicons name="warning" size={16} color="#d97706" />
            <Text className="text-yellow-800 text-sm font-medium ml-2">
              Security Notice
            </Text>
          </View>
          <Text className="text-yellow-700 text-xs mt-1">
            Admin access allows full control over app content. Keep credentials secure.
          </Text>
        </View>
      </View>
    </View>
  );
};