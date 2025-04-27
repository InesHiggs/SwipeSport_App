import React from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';
import { AppStyles } from '@/constants/AppStyles';

interface SvgLogoProps {
  width?: number;
  height?: number;
  style?: any;
}

// Using Image component with SVG file for web and PNG fallback for mobile
const SvgLogo: React.FC<SvgLogoProps> = ({ width = 150, height = 60, style }) => {
  // Use PNG fallback for mobile platforms
  const logoSource = Platform.OS === 'web' 
    ? require('../assets/images/title-logo.svg')
    : require('../assets/images/title-logo.png');

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={logoSource} 
        style={{ width, height }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SvgLogo;
