import { Stack, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const [fontsLoaded] = useFonts({
    "PlayfairDisplay-Regular": require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    "PlayfairDisplay-Medium": require("../assets/fonts/PlayfairDisplay-Medium.ttf"),
  });

  useEffect(() => {
    const loadPersistedAuth = async () => {
      try {
        const persistedUser = await AsyncStorage.getItem("@user");
        if (persistedUser) {
          setUser(JSON.parse(persistedUser));
        }
      } catch (error) {
        console.error("Error loading persisted auth:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      try {
        if (user) {
          // Store user data in AsyncStorage
          await AsyncStorage.setItem("@user", JSON.stringify(user));
          setUser(user);
          router.replace("/");
        } else {
          // Clear stored user data
          await AsyncStorage.removeItem("@user");
          setUser(null);
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Error persisting auth state:", error);
      } finally {
        setInitializing(false);
      }
    });

    loadPersistedAuth();
    return () => unsubscribe();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      onLayout={onLayoutRootView}
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <Stack.Screen name="auth/login" />
      ) : (
        <Stack.Screen name="index" />
      )}
    </Stack>
  );
}
