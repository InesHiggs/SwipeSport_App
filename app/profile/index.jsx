import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { Button, Menu, Provider, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/FirebaseConfig";
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
  const [level, setLevel] = useState("Select Level");
  const [availability, setAvailability] = useState("Select Availability");
  const [levelMenuVisible, setLevelMenuVisible] = useState(false);
  const [availabilityMenuVisible, setAvailabilityMenuVisible] = useState(false);

  const router = useRouter();

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
          setLevel(userData.level || "Select Level");
          setAvailability(userData.availability || "Select Availability");
        }
      }
    });

    return () => unsubscribe();
  }, []);

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
        level,
        availability,
      });

      console.log("User profile updated successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const renderDropdownWithMenu = (
    label,
    value,
    menuVisible,
    setMenuVisible,
    options,
    onSelect
  ) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{label}</Text>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.input}
            contentStyle={{ justifyContent: "space-between" }}
          >
            {value}
            <MaterialIcons name="arrow-drop-down" size={22} color="#4b0082" />
          </Button>
        }
      >
        {options.map((item) => (
          <Menu.Item
            key={item}
            onPress={() => {
              onSelect(item);
              setMenuVisible(false);
            }}
            title={item}
          />
        ))}
      </Menu>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={require("@/assets/images/background.png")}
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

            {/* Name Input */}
            <TextInput
              label="Name"
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            {/* Dropdowns */}
            {renderDropdownWithMenu(
              "Gender",
              gender,
              genderMenuVisible,
              setGenderMenuVisible,
              ["Male", "Female", "Other"],
              setGender
            )}

            {renderDropdownWithMenu(
              "Level",
              level,
              levelMenuVisible,
              setLevelMenuVisible,
              ["Beginner", "Intermediate", "Advanced", "Professional", "Expert"],
              setLevel
            )}

            {renderDropdownWithMenu(
              "Availability",
              availability,
              availabilityMenuVisible,
              setAvailabilityMenuVisible,
              ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              setAvailability
            )}

            {/* Save Button */}
            <Button
              mode="contained"
              onPress={handleUpdateProfile}
              style={styles.saveButton}
            >
              Save Changes
            </Button>
          </View>
        </Provider>
      </ImageBackground>
    </KeyboardAvoidingView>
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
  dropdownContainer: {
    position: "relative",
    marginBottom: 20,
  },
  dropdownLabel: {
    position: "absolute",
    top: -8,
    left: 12,
    paddingHorizontal: 4,
    fontSize: 12,
    zIndex: 1,
    color: "#555",
    backgroundColor: "#d8b4fe",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#863f9c",
  },
});

export default ProfileScreen;
