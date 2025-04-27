import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AppStyles } from '@/constants/AppStyles';

interface TitleLogoProps {
  width?: number;
  height?: number;
}

const TitleLogo: React.FC<TitleLogoProps> = ({ width = 150, height = 30 }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.logoText}>
        <Text style={styles.swipeText}>Swipe</Text>
        <Text style={styles.sportText}>Sport</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: AppStyles.Spacing.m,
    paddingVertical: AppStyles.Spacing.xs,
    borderRadius: AppStyles.BorderRadius.l,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  swipeText: {
    color: AppStyles.Colors.primary,
  },
  sportText: {
    color: AppStyles.Colors.primaryDark,
  },
});

export default TitleLogo;
