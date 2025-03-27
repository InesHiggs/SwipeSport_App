import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      console.log("I am signing out");
      await signOut(FIREBASE_AUTH);
      console.log("I signed out");
      router.replace('/auth/login');
    } catch (error) {
      console.error("Sign Out Error:", error.message);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(0,0,0,0.5)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to Swipesort!</Text>

          <View style={styles.buttonContainer}>
            <CustomButton text="Profile" onPress={() => router.push('/profile')} />
            <CustomButton 
              text="Find Partners" 
              onPress={() => router.push('/meet')} 
              style={styles.highlightButton} 
              textStyle={styles.highlightButtonText} 
            />
            <CustomButton text="Accepted" onPress={() => router.push('/accepted_people')} />
            <CustomButton text="Chats" onPress={() => router.push('/chat')} />
            <CustomButton text="Log out" onPress={handleSignOut} />
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const CustomButton = ({ text, onPress, style, textStyle }) => (
  <TouchableOpacity 
    style={[styles.button, style]} 
    onPress={onPress} 
    activeOpacity={0.8}
  >
    <Text style={[styles.buttonText, textStyle]}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#863f9c',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  highlightButton: {
    backgroundColor: '#ff6b6b',
    borderWidth: 1,
    borderColor: '#fff',
  },
  highlightButtonText: {
    fontWeight: '700',
  },
});

export default HomeScreen;
