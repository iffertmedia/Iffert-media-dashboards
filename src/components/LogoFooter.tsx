import React from 'react';
import { View, Image } from 'react-native';

export const LogoFooter: React.FC = () => {
  return (
    <View className="items-center pt-6 pb-4">
      <Image 
        source={require('../../assets/images/logo.png')} 
        className="w-24 h-10"
        resizeMode="contain"
        style={{ opacity: 0.6 }}
      />
    </View>
  );
};