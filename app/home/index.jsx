// HomeScreen.jsx
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth'; 
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const HomeScreen = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      console.log("I am signing out");
      await signOut(FIREBASE_AUTH); // Log out from Firebase
      console.log("I signed ou");
      router.replace('/auth/login'); // Redirect to login screen
    } catch (error) {
      console.error("Sign Out Error:", error.message);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Swipesort!</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/profile')}>
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/configuration')}>
          <Text style={styles.buttonText}>Config</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/match')}>
          <Text style={styles.buttonText}>Match</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/accepted_people')}>
          <Text style={styles.buttonText}>Accepted</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/chat')}>
          <Text style={styles.buttonText}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={FIREBASE_AUTH.signOut()}>
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4b4b4b',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#863f9c',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default HomeScreen;
