import { useRouter } from "expo-router";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig'; // Ensure correct path
import { collection, doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const router = useRouter();

  // User state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [level, setLevel] = useState("");

  // Handle sign-up and store user in Firestore
  const handleSignUp = async () => {
    if (!email || !password || !name || !age || !gender || !level) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(FIRESTORE_DB, "users", user.uid), {
        uid: user.uid,
        name,
        age: parseInt(age),
        gender,
        level,
        email,
      });

      // Navigate to home screen
      router.push("/");
    } catch (error) {
      console.error("SignUp Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail} />
      <TextInput secureTextEntry value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={setPassword} />
      <TextInput value={name} style={styles.input} placeholder="Name" onChangeText={setName} />
      <TextInput value={age} style={styles.input} placeholder="Age" keyboardType="numeric" onChangeText={setAge} />
      <TextInput value={gender} style={styles.input} placeholder="Gender" onChangeText={setGender} />
      <TextInput value={level} style={styles.input} placeholder="Level" onChangeText={setLevel} />
      <Button title="Ccreate Account" onPress={handleSignUp} />
    </View>
  );
}

// Styles for the form
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
