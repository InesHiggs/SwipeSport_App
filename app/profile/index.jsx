import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { Button, Menu, Provider, Portal, Dialog, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { DatePickerModal } from "react-native-paper-dates";
import { registerTranslation } from "react-native-paper-dates";
import { enUS } from "date-fns/locale";
import { MaterialIcons } from '@expo/vector-icons'; // For edit icon

registerTranslation("en-US", enUS);

const ProfileScreen = () => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState("Select Gender");
    const [genderMenuVisible, setGenderMenuVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [birthdate, setBirthdate] = useState(null);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [saveDialogVisible, setSaveDialogVisible] = useState(false);

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

    // Handle Save Changes
    const handleSaveChanges = () => {
        const userData = {
            name,
            gender,
            birthdate,
            image,
        };
        console.log("Saving user data:", userData);
        setSaveDialogVisible(true);
    };

    return (
        <ImageBackground
              source={require('@/assets/images/background.png')}
              style={styles.container}
            >
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

                {/* Input Fields */}
                <TextInput
                    label="Name"
                    mode="outlined"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    theme={{ colors: { primary: "#7e22ce", text: "#7e22ce" } }} // Purple text inside input
                />

                <Button 
                    mode="outlined" 
                    onPress={() => setDatePickerVisible(true)} 
                    style={styles.input} 
                    labelStyle={styles.buttonText} // Custom button text color
                >
                    {birthdate ? birthdate.toDateString() : "Select Birthdate"}
                </Button>
                <DatePickerModal
                    locale="en"
                    mode="single"
                    visible={datePickerVisible}
                    onDismiss={() => setDatePickerVisible(false)}
                    date={birthdate}
                    onConfirm={(params) => {
                        setDatePickerVisible(false);
                        setBirthdate(params.date);
                    }}
                />

                {/* Gender Selection */}
                <Menu
                    visible={genderMenuVisible}
                    onDismiss={() => setGenderMenuVisible(false)}
                    anchor={
                        <Button 
                            mode="outlined" 
                            onPress={() => setGenderMenuVisible(true)} 
                            style={styles.input} 
                            labelStyle={styles.buttonText} // Custom button text color
                        >
                            {gender}
                        </Button>
                    }
                >
                    <Menu.Item onPress={() => { setGender("Male"); setGenderMenuVisible(false); }} title="Male" />
                    <Menu.Item onPress={() => { setGender("Female"); setGenderMenuVisible(false); }} title="Female" />
                    <Menu.Item onPress={() => { setGender("Other"); setGenderMenuVisible(false); }} title="Other" />
                </Menu>

                {/* Save Button */}
                <Button 
                    mode="contained" 
                    onPress={handleSaveChanges} 
                    style={styles.saveButton} 
                    labelStyle={styles.ButtonText} // Custom text style
                >
                    Save Changes
                </Button>


                {/* Dialog Confirmation */}
                
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
        //backgroundColor: "#f8f9fa", // Light background
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
        borderColor: "#7e22ce", // Darker purple
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
        backgroundColor: "#d8b4fe", // Light purple
        borderColor: "#7e22ce", // Darker purple border
    },
    buttonText: {
        color: "#4a0470", // Deep purple text
        fontWeight: "bold",
    },
    button: {
        marginBottom: 15,
        backgroundColor: "#d8b4fe", // Light purple
        borderColor: "#7e22ce", // Darker purple border
    },
    saveButton: {
        marginTop: 20,
        backgroundColor: "#863f9c", // Light purple
        borderColor: "#7e22ce", // Darker purple border
        
    },
});


export default ProfileScreen;
