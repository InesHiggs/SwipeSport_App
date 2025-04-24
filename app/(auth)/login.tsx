import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { ThemedText } from "../../components/ThemedText";
import { Colors } from "../../constants/Colors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (error) {
      if (error instanceof Error) {
        alert("Sign in failed: " + error.message);
      } else {
        alert("Sign in failed: An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {/* Brand Name Container */}
        <View style={styles.brandContainer}>
          <ThemedText style={styles.brandName}>SwipeSport</ThemedText>
        </View>

        {/* Login Form Container */}
        <View style={styles.loginContainer}>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title}>Login</ThemedText>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              value={email}
              style={styles.input}
              placeholder="University email"
              placeholderTextColor={Colors.light.placeholder}
              autoCapitalize="none"
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              value={password}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.light.placeholder}
              autoCapitalize="none"
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          {" "}
          {/* Add bottom margin to account for absolute positioned signup */}
          <TouchableOpacity
            style={[styles.button]} // Add margin here
            onPress={signIn}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? "Loading..." : "Next"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <ThemedText style={styles.signupText}>
              No account?{" "}
              <ThemedText style={styles.signupLink}>Sign up</ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    zIndex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30, // Add extra padding for top
  },
  brandContainer: {
    marginBottom: 48, // Add more space between SwipeSport and login container
    alignItems: "center",
  },
  loginContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
    gap: 8, // Space between title and inputs
  },
  titleContainer: {
    alignItems: "center",
  },
  brandName: {
    textAlign: "center",
    color: Colors.light.primary,
    fontSize: 48,
    fontFamily: "PlayfairDisplay-Medium",
    fontWeight: "500",
  },
  title: {
    textAlign: "center",
    color: Colors.light.primary, // Update to use primary color
    fontSize: 24,
    fontFamily: "PlayfairDisplay-Medium",
    marginBottom: 8,
    lineHeight: 40,
    includeFontPadding: false,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderColor: "#E2E8F0",
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#000000", // Changed from "#fff" to black
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 34 : 24,
    width: "100%",
    alignItems: "center",
    marginTop: 14, // Add spacing above signup text
  },
  signupText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  signupLink: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
});
