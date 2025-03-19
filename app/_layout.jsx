import { Stack, useRouter } from "expo-router";
import {useEffect, useState} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";

const RootLayout = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      if(!user){
        router.replace("/auth/login"); //If user not authenticated -> login page
      } else{
        router.replace("/home"); //Go to home page if auth
      }
    });
    return () => unsubscribe();
    }, []);

    return (
      <Stack>
        {user ? (
          <>
            <Stack.Screen name="home" options={{ title: "Home" }} />
            <Stack.Screen name="profile" options={{ headerTitle: "Profile" }} />
            <Stack.Screen name="chat" options={{ headerTitle: "Chats" }} />
            <Stack.Screen name="match" options={{ headerTitle: "Match" }} />
            <Stack.Screen name="accepted_people" options={{ headerTitle: "Accepted" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="auth/loginin" options={{ headerTitle: "Login" }} />
            <Stack.Screen name="auth/signupup" options={{ headerTitle: "Sign Up" }} />
          </>
        )}
      </Stack>
    );
  };
  
  export default RootLayout;