import React, { useState, useEffect } from 'react';
// [converted from react-native] import { div, span, spanInput, Pressable, Alert, ActivityIndicator } from 'react-native';
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
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div 
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
        
        <div className="flex-1">
          <span className="text-lg font-bold text-gray-900">
            Admin Login
          </span>
          <span className="text-sm text-gray-600">
            Access restricted to administrators only
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
          {/* Logo/Icon */}
          <div className="bg-black rounded-full p-4 items-center justify-center mb-6 self-center">
            <Ionicons name="shield-checkmark" size={32} color="white" />
          </div>

          <span className="text-xl font-bold text-gray-900 text-center mb-2">
            Admin Access
          </span>
          
          <span className="text-gray-600 text-center mb-6">
            Sign in to manage app content and settings
          </span>

          {/* Username Field */}
          <span className="text-sm font-medium text-gray-700 mb-2">
            Username
          </span>
          <spanInput
            value={credentials.username}
            onChangespan={(text) => setCredentials({...credentials, username: text})}
            placeholder="Enter username"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            className="border border-gray-300 rounded-lg px-3 py-3 text-base bg-white mb-4"
            placeholderspanColor="#9ca3af"
          />

          {/* Password Field */}
          <span className="text-sm font-medium text-gray-700 mb-2">
            Password
          </span>
          <div className="relative mb-6">
            <spanInput
              value={credentials.password}
              onChangespan={(text) => setCredentials({...credentials, password: text})}
              placeholder="Enter password"
              securespanEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              className="border border-gray-300 rounded-lg px-3 py-3 pr-12 text-base bg-white"
              placeholderspanColor="#9ca3af"
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
          </div>

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
                <span className="text-white font-medium text-base ml-2">
                  Sign In
                </span>
              </>
            )}
          </Pressable>

          {/* Demo Credentials Helper */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <span className="text-xs text-gray-500 text-center mb-3">
              Demo Credentials (for testing):
            </span>
            <Pressable
              onPress={handleDemoCredentials}
              disabled={isLoading}
              className="bg-gray-100 rounded-lg p-3"
            >
              <span className="text-gray-700 text-center text-sm">
                Username: admin
              </span>
              <span className="text-gray-700 text-center text-sm">
                Password: iffert2024
              </span>
              <span className="text-blue-600 text-center text-xs mt-1">
                Tap to auto-fill
              </span>
            </Pressable>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-4">
          <div className="flex-row items-center">
            <Ionicons name="warning" size={16} color="#d97706" />
            <span className="text-yellow-800 text-sm font-medium ml-2">
              Security Notice
            </span>
          </div>
          <span className="text-yellow-700 text-xs mt-1">
            Admin access allows full control over app content. Keep credentials secure.
          </span>
        </div>
      </div>
    </div>
  );
};