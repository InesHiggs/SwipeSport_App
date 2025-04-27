import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { View, StyleSheet } from "react-native";
import Navbar from "@/components/Navbar";

const RootLayout = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      if(!user){
        router.replace("/auth/login"); //If user not authenticated -> login page
      } else{
        router.replace("/meet"); //Go to find/meet page as default
      }
    });
    return () => unsubscribe();
    }, []);    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }}>
            {user ? (
              <>
                <Stack.Screen name="index" />
                <Stack.Screen name="profile" />
                <Stack.Screen name="chats" />
                <Stack.Screen name="match" />
                <Stack.Screen name="meet" options={{ headerTitle: "Find" }} />
                <Stack.Screen name="accepted_people" />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </>
            ) : (
              <>
                <Stack.Screen name="auth/loginin" options={{ headerTitle: "Login" }} />
                <Stack.Screen name="auth/signupup" options={{ headerTitle: "Sign Up" }} />
              </>
            )}
          </Stack>
        </View>
        {user && <View style={styles.navbarContainer}><Navbar /></View>}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});
  
export default RootLayout;