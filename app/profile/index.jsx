import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { Button, Menu, Provider, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/FirebaseConfig"; // Ensure correct path
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";

const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState("Select Gender");
    const [genderMenuVisible, setGenderMenuVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [birthdate, setBirthdate] = useState(null);
    const [userId, setUserId] = useState(null);

    const router = useRouter();

    // Fetch current user details from Firestore
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                setUserId(user.uid);
                const userRef = doc(FIRESTORE_DB, "users", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setName(userData.name || "");
                    setGender(userData.gender || "Select Gender");
                    setBirthdate(userData.birthdate ? new Date(userData.birthdate) : null);
                    setImage(userData.image || null);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    // Pick an image from the gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Handle updating user information
    const handleUpdateProfile = async () => {
        if (!userId) {
            console.error("User ID not found.");
            return;
        }

        try {
            const userRef = doc(FIRESTORE_DB, "users", userId);
            await updateDoc(userRef, {
                name,
                gender,
                birthdate: birthdate ? birthdate.toISOString() : null,
                image,
            });

            console.log("User profile updated successfully!");
            router.push("/"); // Redirect to home after saving
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <ImageBackground source={require("@/assets/images/background.png")} style={styles.container}>
            <Provider>
                <View style={styles.container}>
                    {/* Profile Picture with Edit Icon */}
                    <View style={styles.profileContainer}>
                        <TouchableOpacity onPress={pickImage} style={styles.profilePicWrapper}>
                            <Image
                                source={image ? { uri: image } : require("@/assets/images/bgd.png")}
                                style={styles.profilePic}
                            />
                            <View style={styles.editIcon}>
                                <MaterialIcons name="edit" size={20} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Name Input */}
                    <TextInput
                        label="Name"
                        mode="outlined"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />

                    {/* Gender Selection */}
                    <Menu
                        visible={genderMenuVisible}
                        onDismiss={() => setGenderMenuVisible(false)}
                        anchor={
                            <Button mode="outlined" onPress={() => setGenderMenuVisible(true)} style={styles.input}>
                                {gender}
                            </Button>
                        }
                    >
                        <Menu.Item onPress={() => { setGender("Male"); setGenderMenuVisible(false); }} title="Male" />
                        <Menu.Item onPress={() => { setGender("Female"); setGenderMenuVisible(false); }} title="Female" />
                        <Menu.Item onPress={() => { setGender("Other"); setGenderMenuVisible(false); }} title="Other" />
                    </Menu>

                    {/* Save Button */}
                    <Button mode="contained" onPress={handleUpdateProfile} style={styles.saveButton}>
                        Save Changes
                    </Button>
                </View>
            </Provider>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    profileContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    profilePicWrapper: {
        position: "relative",
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: "#7e22ce",
    },
    editIcon: {
        position: "absolute",
        bottom: 5,
        right: 5,
        backgroundColor: "#7e22ce",
        padding: 5,
        borderRadius: 15,
    },
    input: {
        marginBottom: 15,
        backgroundColor: "#d8b4fe",
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: "#863f9c",
    },
});

export default ProfileScreen;
