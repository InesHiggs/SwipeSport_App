import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

type User = {
  uid: string;
  email: string;
  name?: string;
  sport?: string;
  sportName?: string;
  proficiency?: string;
  photo?: string | null;
  dateOfBirth?: string;
  gender?: string;
  preferredLevel?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === "auth";
      if (user && inAuthGroup) {
        router.replace("/");
      } else if (!user && !inAuthGroup) {
        router.replace("/auth/login");
      }
    }
  }, [user, segments, isLoading]);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) {
        setUserState(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setUser = async (newUser: User | null) => {
    try {
      if (newUser) {
        await AsyncStorage.setItem("user", JSON.stringify(newUser));
      } else {
        await AsyncStorage.removeItem("user");
      }
      setUserState(newUser);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
