import React from 'react';
import { AdminTabNavigator } from '../navigation/AdminTabNavigator';
import { AuthGuard } from '../components/auth/AuthGuard';

interface AdminScreenProps {
  navigation: any;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ navigation }) => {
  return (
    <AuthGuard 
      navigation={navigation}
      fallbackMessage="Administrator access required to manage app content, products, campaigns, and creators."
    >
      <AdminTabNavigator />
    </AuthGuard>
  );
};