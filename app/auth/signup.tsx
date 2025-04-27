import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, doc, setDoc } from "firebase/firestore";
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaterialTextInput from '@/components/MaterialTextInput';
import MaterialButton from '@/components/MaterialButton';
import { AppStyles } from '@/constants/AppStyles';

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
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

      Alert.alert("Success", "Account created successfully!");
      // Navigate to home screen
      router.push("/");
    } catch (error: any) {
      console.error("SignUp Error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView useMaterialBackground style={styles.container}>
      {/* Background blurbs */}
      <View style={styles.backgroundBlurbs}>
        <View style={styles.largeBlurb} />
        <View style={styles.smallBlurb} />
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <ThemedText useMaterialStyle type="headlineLarge" style={styles.title}>
          Create Account
        </ThemedText>
        
        <MaterialTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          fullWidth
          containerStyle={styles.inputContainer}
        />
        
        <MaterialTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secure
          autoCapitalize="none"
          fullWidth
          containerStyle={styles.inputContainer}
        />
        
        <MaterialTextInput
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Your full name"
          fullWidth
          containerStyle={styles.inputContainer}
        />
        
        <MaterialTextInput
          label="Age"
          value={age}
          onChangeText={setAge}
          placeholder="Your age"
          keyboardType="numeric"
          fullWidth
          containerStyle={styles.inputContainer}
        />
        
        <MaterialTextInput
          label="Gender"
          value={gender}
          onChangeText={setGender}
          placeholder="Your gender"
          fullWidth
          containerStyle={styles.inputContainer}
        />
        
        <MaterialTextInput
          label="Skill Level"
          value={level}
          onChangeText={setLevel}
          placeholder="Beginner, Intermediate, Advanced, etc."
          fullWidth
          containerStyle={styles.inputContainer}
        />
        
        {loading ? (
          <ActivityIndicator 
            size="large" 
            color={AppStyles.Colors.primary}
            style={styles.loader}
          />
        ) : (
          <View style={styles.buttonContainer}>
            <MaterialButton 
              title="Create Account" 
              onPress={handleSignUp}
              variant="filled"
              fullWidth
              style={styles.button}
            />
            
            <MaterialButton 
              title="Back to Login" 
              onPress={() => router.back()}
              variant="outlined"
              fullWidth
              style={styles.button}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: AppStyles.Spacing.m,
  },
  backgroundBlurbs: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  largeBlurb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: AppStyles.Colors.primaryLight,
    opacity: 0.3,
    top: '5%',
    right: -100,
  },
  smallBlurb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: AppStyles.Colors.primary,
    opacity: 0.2,
    bottom: '5%',
    left: -50,
  },
  title: {
    textAlign: 'center',
    marginBottom: AppStyles.Spacing.xl,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: AppStyles.Spacing.s,
  },
  loader: {
    marginTop: AppStyles.Spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: AppStyles.Spacing.l,
  },
  button: {
    marginVertical: AppStyles.Spacing.xs,
  },
});
