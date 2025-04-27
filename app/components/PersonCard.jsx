import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { AppStyles } from '@/constants/AppStyles';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const PersonCard = ({ name, level, age, image }) => {
  return (
    <ThemedView useMaterialBackground style={styles.card}>
      <Image source={image ? { uri: image } : require('@/assets/images/bgd.png')} style={styles.image} />
      <View style={styles.info}>
        <ThemedText useMaterialStyle type="titleMedium" style={styles.name}>{name}</ThemedText>
        <ThemedText useMaterialStyle type="bodyMedium" style={styles.details}>Level: {level}</ThemedText>
        <ThemedText useMaterialStyle type="bodyMedium" style={styles.details}>Age: {age}</ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: AppStyles.Spacing.m,
    borderRadius: AppStyles.BorderRadius.m,
    marginBottom: AppStyles.Spacing.s,
    alignItems: 'center',
    ...AppStyles.Shadows.medium,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: AppStyles.Spacing.m,
  },
  info: {
    flex: 1,
  },
  name: {
    marginBottom: AppStyles.Spacing.xxs,
  },
  details: {
    color: AppStyles.Colors.onSurfaceVariant,
  },
});

export default PersonCard;
