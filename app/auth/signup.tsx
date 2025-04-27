import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, doc, setDoc } from "firebase/firestore";
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaterialTextInput from '@/components/MaterialTextInput';
import MaterialButton from '@/components/MaterialButton';
import { AppStyles } from '@/constants/AppStyles';
import SvgLogo from '@/components/SvgLogo';
import BackgroundImage from '@/components/BackgroundImage';

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  // User state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [level, setLevel] = useState("");
  
  // Get email from params if available
  useEffect(() => {
    if (params.email) {
      setEmail(params.email as string);
    }
  }, [params]);

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
      {/* Background image with increased opacity */}
      <BackgroundImage style={{ opacity: 0.3 }} />
      
      <View style={styles.logoContainer}>
        <SvgLogo width={150} height={60} />
        <ThemedText style={styles.tagline}>Find. Match. Play.</ThemedText>
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
              color={AppStyles.Colors.primary}
              fullWidth
              style={styles.button}
            />
            
            <MaterialButton 
              title="Back to Login" 
              onPress={() => router.back()}
              variant="text"
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
  logoContainer: {
    alignItems: 'center',
    marginTop: AppStyles.Spacing.xl,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.5,
    marginTop: AppStyles.Spacing.xs,
  },
  title: {
    textAlign: 'center',
    marginBottom: AppStyles.Spacing.xl,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: AppStyles.Spacing.xl,
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
