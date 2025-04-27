import React from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import PersonCard from '@/app/components/PersonCard';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AppStyles } from '@/constants/AppStyles';

// Hardcoded accepted people
const acceptedPeople = [
  { id: 1, name: 'John Doe', level: 'Beginner', age: 25, image: null },
  { id: 2, name: 'Jane Smith', level: 'Intermediate', age: 30, image: null },
  { id: 3, name: 'Alice Johnson', level: 'Advanced', age: 28, image: null },
];

const AcceptedPeoplePage = () => {
  return (
    <ThemedView useMaterialBackground style={styles.container}>
      {/* Background image */}
      <Image 
        source={require('@/assets/images/bg.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />
      
      <ThemedText useMaterialStyle type="headlineMedium" style={styles.title}>Accepted People</ThemedText>
      <FlatList
        data={acceptedPeople}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PersonCard name={item.name} level={item.level} age={item.age} image={item.image} />
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: AppStyles.Spacing.m,
    paddingTop: 80, // Added padding to account for navbar
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    zIndex: -1,
  },
  title: {
    textAlign: 'center',
    marginBottom: AppStyles.Spacing.l,
  },
});

export default AcceptedPeoplePage;
