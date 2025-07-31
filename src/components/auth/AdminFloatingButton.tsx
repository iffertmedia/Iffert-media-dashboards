import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/useAuthStore';
import { useNavigation } from '@react-navigation/native';

export const AdminFloatingButton: React.FC = () => {
  const { isAdmin } = useAuthStore();
  const navigation = useNavigation();

  // Don't show if user is already admin
  if (isAdmin()) {
    return null;
  }

  return (
    <Pressable
      onPress={() => navigation.navigate('Login' as never)}
      className="absolute bottom-20 right-4 bg-black rounded-full p-3 shadow-lg"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Ionicons name="shield-checkmark" size={24} color="white" />
    </Pressable>
  );
};