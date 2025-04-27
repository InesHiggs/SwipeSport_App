import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { AppStyles } from '@/constants/AppStyles';
import * as Font from 'expo-font';

const MessagesHeader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'PlayfairDisplay': require('@/assets/fonts/PlayfairDisplay-VariableFont_wght.ttf'),
          'PlayfairDisplay-Italic': require('@/assets/fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.error('Error loading fonts:', e);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { fontFamily: undefined }]}>Messages</Text>
      </View>
    );
  }

  return (
    <View style={styles.headerContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Text style={styles.headerText}>Messages</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: AppStyles.Spacing.l,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: AppStyles.Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: AppStyles.Colors.divider,
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerText: {
    fontSize: 38,
    fontFamily: 'PlayfairDisplay',
    fontWeight: '600',
    color: AppStyles.Colors.onSurface,
    textAlign: 'left',
  }
});

export default MessagesHeader;
