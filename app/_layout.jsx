import { Stack, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [fontsLoaded] = useFonts({
    "PlayfairDisplay-Regular": require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    "PlayfairDisplay-Medium": require("../assets/fonts/PlayfairDisplay-Medium.ttf"),
  });

  console.log("Fonts loaded:", fontsLoaded); // Add this line to debug

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      if (!user) {
        router.replace("/auth/login");
      } else {
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack onLayout={onLayoutRootView}>
      {user ? (
        <>
          <Stack.Screen name="home" options={{ title: "Home" }} />
          <Stack.Screen name="profile" options={{ headerTitle: "Profile" }} />
          <Stack.Screen name="chats" options={{ headerTitle: "Chats" }} />
          <Stack.Screen name="match" options={{ headerTitle: "Match" }} />
          <Stack.Screen
            name="meet"
            options={{ headerTitle: "Find Partners" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="auth/loginin"
            options={{ headerTitle: "Login" }}
          />
          <Stack.Screen
            name="auth/signupup"
            options={{ headerTitle: "Sign Up" }}
          />
        </>
      )}
    </Stack>
  );
}
