import { View, TextInput, Text, StyleSheet, Button, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import React, { useState, Component } from 'react';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; 
import {getFirestore, doc, setDoc} from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {useRouter} from "expo-router";

type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
};

const router = useRouter();//using Expo router for nav

//type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [loading, setloading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async() => {
        setloading(true);
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log("Login Successful",response);
            alert('Check your emails!')
            router.replace("/");//go to the home page
        }catch(error: any){
            console.log(error);
            alert('Sign in failed: ' + error.message);
        }finally{
            setloading(false);
        }
    }

  return(
    <View style={styles.container}>
        <KeyboardAvoidingView behavior= 'padding'>
            <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none"onChangeText={(text) =>setEmail(text)}></TextInput>
            <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="password" autoCapitalize="none"onChangeText={(text) =>setpassword(text)}></TextInput>
            {loading ? (
            <ActivityIndicator size="large" color="#0000ff"/>
            ) : (
            <>
            <Button title="Login" onPress={() => signIn()}/>   
            <Button title="Create Account" onPress={() => router.push('/auth/signup')} />   
            
            </> 
            )}
        </KeyboardAvoidingView>
    </View>
  );
}; 

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input:{
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    }
})