import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { useRouter } from "expo-router";
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaterialTextInput from '@/components/MaterialTextInput';
import MaterialButton from '@/components/MaterialButton';
import { AppStyles } from '@/constants/AppStyles';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const router = useRouter();
    
    const signIn = async() => {
        setLoading(true);
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login Successful", response);
            alert('Login successful!')
            router.replace("/");
        } catch(error: any) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <ThemedView useMaterialBackground style={styles.container}>
      {/* Background image */}
      <Image 
        source={require('@/assets/images/bg.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />
      
      <ThemedText useMaterialStyle type="headlineLarge" style={styles.title}>
        SwipeSport
      </ThemedText>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <MaterialTextInput
          label="Email"
          value={email}
          onChangeText={(text: string) => setEmail(text)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          fullWidth
          containerStyle={styles.inputContainer}
        />
        
        <MaterialTextInput
          label="Password"
          value={password}
          onChangeText={(text: string) => setPassword(text)}
          placeholder="Enter your password"
          secure
          autoCapitalize="none"
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
              title="Login" 
              onPress={signIn}
              variant="filled"
              fullWidth
              style={styles.button}
            />
            
            <MaterialButton 
              title="Create Account" 
              onPress={() => router.push('/auth/signup')}
              variant="outlined"
              fullWidth
              style={styles.button}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}; 

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: AppStyles.Spacing.l,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    zIndex: -1,
  },
  title: {
    textAlign: 'center',
    marginBottom: AppStyles.Spacing.xxl,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: AppStyles.Spacing.m,
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
    marginVertical: AppStyles.Spacing.s,
  },
})
