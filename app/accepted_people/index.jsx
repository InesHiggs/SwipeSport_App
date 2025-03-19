import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import PersonCard from '@/app/components/PersonCard'; // Import the PersonCard component

// Hardcoded accepted people
const acceptedPeople = [
  { id: 1, name: 'John Doe', level: 'Beginner', age: 25, image: null },
  { id: 2, name: 'Jane Smith', level: 'Intermediate', age: 30, image: null },
  { id: 3, name: 'Alice Johnson', level: 'Advanced', age: 28, image: null },
];

const AcceptedPeoplePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accepted People</Text>
      <FlatList
        data={acceptedPeople}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PersonCard name={item.name} level={item.level} age={item.age} image={item.image} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AcceptedPeoplePage;
