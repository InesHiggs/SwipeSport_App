import { View, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Image, Dimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { useRouter } from "expo-router";
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaterialTextInput from '@/components/MaterialTextInput';
import MaterialButton from '@/components/MaterialButton';
import { AppStyles } from '@/constants/AppStyles';
import SvgLogo from '@/components/SvgLogo';
import BackgroundImage from '@/components/BackgroundImage';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const auth = FIREBASE_AUTH;
    const router = useRouter();
    const screenWidth = Dimensions.get('window').width;
    
    const signIn = async() => {
        setLoading(true);
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login Successful", response);
            router.replace("/");
        } catch(error: any) {
            console.log(error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }
    
    const goToRegister = () => {
        router.push({
            pathname: '/auth/signup',
            params: { email: email }
        });
    }

  return (
    <ThemedView useMaterialBackground style={styles.container}>
      {/* Background image with increased opacity */}
      <BackgroundImage style={{ opacity: 0.3 }} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Header section - Give full priority */}
          <View style={styles.logoContainer}>
            <SvgLogo width={screenWidth * 0.7} height={80} style={styles.logo} />
            <ThemedText style={styles.tagline}>Find. Match. Play.</ThemedText>
          </View>
          
          {/* Image section - Scale in remaining space */}
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../assets/images/sport-list.png')} 
              style={styles.centerImage}
              resizeMode="contain"
              resizeMethod="resize"
            />
          </View>
          
          {/* Form section - Always maintain proper size */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formContainer}
          >
            {!showPassword ? (
              <>
                <MaterialTextInput
                  label="Email"
                  value={email}
                  onChangeText={(text: string) => setEmail(text)}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  fullWidth={screenWidth < 500} // Only full width on smaller screens
                  containerStyle={[
                    styles.inputContainer,
                    screenWidth >= 500 && { width: '80%' }
                  ]}
                />
                
                {loading ? (
                  <ActivityIndicator 
                    size="large" 
                    color={AppStyles.Colors.primary}
                    style={styles.loader}
                  />
                ) : (
                  <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                      <MaterialButton 
                        title="Next" 
                        onPress={() => setShowPassword(true)}
                        variant="filled"
                        color={AppStyles.Colors.primary}
                        style={styles.button}
                      />
                    </View>
                    
                    <View style={styles.buttonWrapper}>
                      <MaterialButton 
                        title="Register" 
                        onPress={goToRegister}
                        variant="text"
                        style={styles.button}
                      />
                    </View>
                  </View>
                )}
              </>
            ) : (
              <>
                <MaterialTextInput
                  label="Password"
                  value={password}
                  onChangeText={(text: string) => setPassword(text)}
                  placeholder="Enter your password"
                  secure={true}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  fullWidth={screenWidth < 500} // Only full width on smaller screens
                  containerStyle={[
                    styles.inputContainer,
                    screenWidth >= 500 && { width: '80%' }
                  ]}
                  trailingAction={() => setIsPasswordVisible(!isPasswordVisible)}
                />
                
                {loading ? (
                  <ActivityIndicator 
                    size="large" 
                    color={AppStyles.Colors.primary}
                    style={styles.loader}
                  />
                ) : (
                  <View style={styles.buttonContainer}>
                    <View style={styles.buttonWrapper}>
                      <MaterialButton 
                        title="Login" 
                        onPress={signIn}
                        variant="filled"
                        color={AppStyles.Colors.primary}
                        style={styles.button}
                      />
                    </View>
                    
                    <View style={styles.buttonWrapper}>
                      <MaterialButton 
                        title="Back" 
                        onPress={() => setShowPassword(false)}
                        variant="text"
                        style={styles.button}
                      />
                    </View>
                  </View>
                )}
              </>
            )}
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </ThemedView>
  );
}; 

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: AppStyles.Spacing.l,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: AppStyles.Spacing.xl,
    marginBottom: AppStyles.Spacing.m,
  },
  logo: {
    marginBottom: AppStyles.Spacing.s,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.5, // 50% opacity as requested
    marginTop: AppStyles.Spacing.xs,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: AppStyles.Spacing.s,
    minHeight: 100, // Minimum height for the image container
    maxHeight: '50%', // Maximum height to maintain priorities
  },
  centerImage: {
    width: '80%',
    height: '100%',
    maxHeight: '100%',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: AppStyles.Spacing.m, // Reduced from l to m
    marginBottom: AppStyles.Spacing.l, // Reduced from xl to l
  },
  inputContainer: {
    marginBottom: AppStyles.Spacing.m,
    width: '100%',
  },
  loader: {
    marginTop: AppStyles.Spacing.l, // Reduced from xl
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: AppStyles.Spacing.m, // Reduced from l to m
  },
  buttonWrapper: {
    width: '80%', // Control width of the button container
    alignItems: 'center',
  },
  button: {
    marginVertical: AppStyles.Spacing.xs, // Reduced from s to xs
    minWidth: '100%', // Take full width of its container
  },
});
