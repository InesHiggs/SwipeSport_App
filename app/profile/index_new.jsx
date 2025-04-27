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
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaterialButton from '@/components/MaterialButton';
import { AppStyles } from '@/constants/AppStyles';

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Select Gender");
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [birthdate, setBirthdate] = useState(null);
  const [userId, setUserId] = useState(null);
  const [level, setLevel] = useState("Select Level");
  const [availability, setAvailability] = useState([]);
  const [levelMenuVisible, setLevelMenuVisible] = useState(false);
  const [levelPreferences, setLevelPreferences] = useState([]);

  const router = useRouter();
  
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Handle logout function
  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      console.log("User signed out successfully");
      router.replace('/auth/login');
    } catch (error) {
      console.error("Sign Out Error:", error.message);
    }
  };

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
          setAvailability(userData.availability || []);
          setLevelPreferences(userData.levelPreference || []);
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

  const toggleAvailabilityDay = (day) => {
    setAvailability((prevAvailability) => {
      if (prevAvailability.includes(day)) {
        return prevAvailability.filter((d) => d !== day);
      } else {
        return [...prevAvailability, day];
      }
    });
  };

  const navigateToLevelPreferences = () => {
    router.push("/level_preference");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={require("@/assets/images/bg.png")}
        style={styles.container}
        imageStyle={{ opacity: 0.15 }}
      >
        <Provider>
          <View style={styles.profileContainer}>
            {/* Profile Picture */}
            <View style={styles.profilePicWrapper}>
              <Image
                source={
                  image
                    ? { uri: image }
                    : require("@/assets/images/icon.png")
                }
                style={styles.profilePic}
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={pickImage}
              >
                <MaterialIcons name="edit" size={18} color="white" />
              </TouchableOpacity>
            </View>

            {/* Name Input */}
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              outlineColor="#c4a8ff"
              activeOutlineColor="#7e22ce"
            />

            {/* Gender Dropdown */}
            {renderDropdownWithMenu(
              "Gender",
              gender,
              genderMenuVisible,
              setGenderMenuVisible,
              ["Male", "Female", "Non-binary", "Prefer not to say"],
              setGender
            )}

            {/* Level Dropdown */}
            {renderDropdownWithMenu(
              "Tennis Level",
              level,
              levelMenuVisible,
              setLevelMenuVisible,
              ["Beginner", "Intermediate", "Advanced", "Professional", "Expert"],
              setLevel
            )}

            {/* Level Preferences Button */}
            <View style={styles.preferenceSection}>
              <View style={styles.preferenceHeader}>
                <Text style={styles.availabilityTitle}>Level Preferences</Text>
                <Text style={styles.preferenceSummary}>
                  {levelPreferences.length > 0 
                    ? levelPreferences.join(", ") 
                    : "No preferences set"}
                </Text>
              </View>
              <Button
                mode="outlined"
                onPress={navigateToLevelPreferences}
                style={styles.preferenceButton}
                icon="tune"
              >
                Edit Level Preferences
              </Button>
            </View>

            {/* Availability Multiple Select */}
            <View style={styles.availabilitySection}>
              <Text style={styles.availabilityTitle}>Availability</Text>
              <Text style={styles.availabilitySubtitle}>Select all days you're available</Text>
              <View style={styles.daysContainer}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      availability.includes(day) && styles.selectedDayButton
                    ]}
                    onPress={() => toggleAvailabilityDay(day)}
                  >
                    <Text style={[
                      styles.dayText,
                      availability.includes(day) && styles.selectedDayText
                    ]}>
                      {day.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <Button
              mode="contained"
              onPress={handleUpdateProfile}
              style={styles.saveButton}
            >
              Save Changes
            </Button>
            
            {/* Logout Button */}
            <Button
              mode="outlined"
              onPress={handleSignOut}
              style={styles.logoutButton}
              icon="logout"
              color="#e53935"
            >
              Log Out
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
  availabilitySection: {
    marginBottom: 20,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  availabilitySubtitle: {
    fontSize: 12,
    marginBottom: 10,
    color: "#666",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dayButton: {
    width: '31%',
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#f0e6ff",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c4a8ff",
  },
  selectedDayButton: {
    backgroundColor: "#863f9c",
    borderColor: "#7e22ce",
  },
  dayText: {
    color: "#333",
    fontWeight: "500",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#863f9c",
  },
  preferenceSection: {
    marginBottom: 20,
  },
  preferenceHeader: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  preferenceSummary: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontStyle: "italic",
  },
  preferenceButton: {
    borderColor: "#c4a8ff",
    borderWidth: 1,
  },
  logoutButton: {
    marginTop: 15,
    borderColor: "#e53935",
    borderWidth: 1,
  },
});

export default ProfileScreen;
