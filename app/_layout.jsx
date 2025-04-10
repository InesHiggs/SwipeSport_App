import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { View, ActivityIndicator } from "react-native";

// Global header styling
const screenOptions = {
  headerStyle: {
    backgroundColor: "#7e22ce", // purple header background
  },
  headerTintColor: "#fff", // white back button & title
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const AuthenticatedLayout = () => (
  <Stack screenOptions={screenOptions}>
    <Stack.Screen name="index" options={{ headerTitle: "Home" }} />
    <Stack.Screen name="profile" options={{ headerTitle: "Profile" }} />
    <Stack.Screen name="chats" options={{ headerTitle: "Chats" }} />
    <Stack.Screen name="match" options={{ headerTitle: "Match" }} />
    <Stack.Screen name="meet" options={{ headerTitle: "Find Partners" }} />
    <Stack.Screen name="accepted_people" options={{ headerTitle: "Accepted People" }} />
    <Stack.Screen name="level_preference" options={{ headerTitle: "Level Preference" }} />
  </Stack>
);

const UnauthenticatedLayout = () => (
  <Stack screenOptions={screenOptions}>
    <Stack.Screen name="auth/login" options={{ headerTitle: "Login" }} />
    <Stack.Screen name="auth/signup" options={{ headerTitle: "Sign Up" }} />
  </Stack>
);

export default function RootLayout() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user ?? null);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <AuthenticatedLayout /> : <UnauthenticatedLayout />;
}
