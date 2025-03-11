import { View, TextInput, Text, StyleSheet, Button, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { NavigationContainerProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const db = getFirestore();
type SignUpProps = NativeStackScreenProps<any, 'SignUp'>;

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [level, setLevel] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;

            // Store additional user data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                age: age,
                gender: gender,
                level: level,
                email: email,
            });

            alert('Account created successfully!');
            navigation.navigate('Login'); // Redirect back to Login after sign-up
        } catch (error: any) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={setEmail} />
                <TextInput secureTextEntry value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={setPassword} />
                <TextInput value={name} style={styles.input} placeholder="Name" onChangeText={setName} />
                <TextInput value={age} style={styles.input} placeholder="Age" keyboardType="numeric" onChangeText={setAge} />
                <TextInput value={gender} style={styles.input} placeholder="Gender" onChangeText={setGender} />
                <TextInput value={level} style={styles.input} placeholder="Level" onChangeText={setLevel} />

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button title="Sign Up" onPress={signUp} />
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    }
});
