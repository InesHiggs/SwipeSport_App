import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { AppStyles } from '@/constants/AppStyles';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaterialButton from '@/components/MaterialButton';
import BackgroundImage from '@/components/BackgroundImage';

// Get screen dimensions
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// Hardcoded list of people
const people = [
  { id: 1, name: 'John Doe', level: 'Beginner', age: 25, image: require('@/assets/images/bgd.png') },
  { id: 2, name: 'Jane Smith', level: 'Intermediate', age: 30, image: require('@/assets/images/bgd.png') },
  { id: 3, name: 'Alice Johnson', level: 'Advanced', age: 28, image: require('@/assets/images/bgd.png') },
  { id: 4, name: 'Bob Lee', level: 'Professional', age: 35, image: require('@/assets/images/bgd.png') },
];

const PeopleListPage = () => {
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
  const currentPerson = people[currentPersonIndex];

  const handleAction = (action) => {
    console.log(`${action} request for ${currentPerson.name}`);
    if (currentPersonIndex < people.length - 1) {
      setCurrentPersonIndex(currentPersonIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Status bar transparent */}
      <StatusBar translucent backgroundColor="transparent" />
      
      {/* Background Image */}
      <BackgroundImage style={{ opacity: 0.15 }} />
      
      {/* Image takes up full height available since no header */}
      <Image source={currentPerson.image} style={styles.personImage} />

      {/* Info section now directly below the image */}
      <ThemedView useMaterialBackground style={styles.infoContainer}>
        <ThemedText useMaterialStyle type="titleLarge" style={styles.name}>{currentPerson.name}</ThemedText>
        <ThemedText useMaterialStyle type="bodyMedium" style={styles.details}>Level: {currentPerson.level} | Age: {currentPerson.age}</ThemedText>
      </ThemedView>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <MaterialButton 
          title="Deny"
          onPress={() => handleAction('Denied')}
          style={styles.button}
          color={AppStyles.Colors.error}
        />

        <MaterialButton 
          title="Accept" 
          onPress={() => handleAction('Accepted')} 
          style={styles.button}
          color={AppStyles.Colors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  personImage: {
    width: '100%',
    height: screenHeight * 0.75, // Increased to 75% since no header
    resizeMode: 'cover',
  },
  infoContainer: {
    width: '90%',
    paddingVertical: AppStyles.Spacing.m,
    alignItems: 'center',
    backgroundColor: AppStyles.Colors.surfaceVariant,
    borderRadius: AppStyles.BorderRadius.m,
    marginTop: AppStyles.Spacing.s,
    ...AppStyles.Shadows.small,
  },
  name: {
    color: AppStyles.Colors.onSurface,
  },
  details: {
    color: AppStyles.Colors.onSurfaceVariant,
    marginTop: AppStyles.Spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: AppStyles.Spacing.l,
    paddingHorizontal: AppStyles.Spacing.l,
  },
  button: {
    width: '45%',
  },
});

export default PeopleListPage;
