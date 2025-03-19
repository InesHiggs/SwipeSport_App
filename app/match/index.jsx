import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

// Get screen height
const screenHeight = Dimensions.get('window').height;

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
      {/* Image takes up 70% of the screen */}
      <Image source={currentPerson.image} style={styles.personImage} />

      {/* Info section now directly below the image */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{currentPerson.name}</Text>
        <Text style={styles.details}>Level: {currentPerson.level} | Age: {currentPerson.age}</Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.denyButton]} onPress={() => handleAction('Denied')}>
          <Text style={styles.buttonText}>Deny</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAction('Accepted')}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  personImage: {
    width: '100%',
    height: screenHeight * 0.7, // 70% of screen height
    resizeMode: 'cover',
  },
  infoContainer: {
    width: '90%',
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginTop: 10, // Space between image and info section
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  denyButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default PeopleListPage;
