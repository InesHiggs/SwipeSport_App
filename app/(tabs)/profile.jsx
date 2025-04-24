import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, Provider, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { Colors } from "../../constants/Colors";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Select Gender");
  const [age, setAge] = useState("");
  const [sports, setSports] = useState([]);
  const [proficiencyLevel, setProficiencyLevel] = useState("Select Level");
  const [availability, setAvailability] = useState([]);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const router = useRouter();

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleLogout = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        setIsInitialLoading(true);
        const userRef = doc(FIRESTORE_DB, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("Fetched user data:", userData); // Debug log

          // Make sure these field names match exactly with your signup form
          setName(userData.fullName || ""); // Changed from name to fullName if that's what you used
          setAge(userData.age ? userData.age.toString() : "");
          setGender(userData.gender || "");
          setSports(
            Array.isArray(userData.sportsInterests)
              ? userData.sportsInterests
              : []
          ); // Changed from sports to sportsInterests if that's what you used
          setProficiencyLevel(userData.skillLevel || ""); // Changed from proficiencyLevel to skillLevel if that's what you used
          setAvailability(
            Array.isArray(userData.availability) ? userData.availability : []
          );
          setImage(userData.photoURL || null);
        } else {
          console.log("No user data found");
          Alert.alert("Error", "No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load profile data");
      } finally {
        setIsInitialLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user);
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
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = image;
      if (image && image.startsWith("file://")) {
        const storage = getStorage();
        const imageRef = ref(storage, `profile_images/${userId}`);

        const response = await fetch(image);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob);

        imageUrl = await getDownloadURL(imageRef);
      }

      const userRef = doc(FIRESTORE_DB, "users", userId);
      await updateDoc(userRef, {
        photoURL: imageUrl,
        availability,
      });

      Alert.alert("Success", "Profile updated successfully!", [{ text: "OK" }]);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailabilityDay = (day) => {
    setAvailability((prevAvailability) => {
      if (prevAvailability.includes(day)) {
        return prevAvailability.filter((d) => d !== day);
      } else {
        return [...prevAvailability, day];
      }
    });
  };

  if (isInitialLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Provider>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          {/* Add header with logout button */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialIcons
                name="logout"
                size={24}
                color={Colors.light.primary}
              />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Profile Picture Section */}
            <View style={styles.profileContainer}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.profilePicWrapper}
              >
                <Image
                  source={
                    image
                      ? { uri: image }
                      : require("../../assets/images/default-avatar.png")
                  }
                  style={styles.profilePic}
                />
                <View style={styles.editIcon}>
                  <MaterialIcons name="edit" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            {/* User Details Section */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  value={name}
                  style={styles.input}
                  disabled={true}
                  mode="flat"
                  contentStyle={styles.inputContent}
                  underlineColor="transparent"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  value={age.toString()}
                  style={styles.input}
                  disabled={true}
                  mode="flat"
                  contentStyle={styles.inputContent}
                  underlineColor="transparent"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                  value={gender}
                  style={styles.input}
                  disabled={true}
                  mode="flat"
                  contentStyle={styles.inputContent}
                  underlineColor="transparent"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Sports Interests</Text>
                <View style={styles.sportsContainer}>
                  {sports.length > 0 ? (
                    sports.map((sport) => (
                      <View key={sport} style={styles.sportChip}>
                        <Text style={styles.sportText}>{sport}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noDataText}>No sports selected</Text>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Proficiency Level</Text>
                <TextInput
                  value={proficiencyLevel}
                  style={styles.input}
                  disabled={true}
                  mode="flat"
                  contentStyle={styles.inputContent}
                  underlineColor="transparent"
                />
              </View>
            </View>

            {/* Availability Section - Now with card styling */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Availability</Text>
              <Text style={styles.subtitle}>
                Select days you're available to play
              </Text>

              <View style={styles.daysContainer}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      availability.includes(day) && styles.selectedDayButton,
                    ]}
                    onPress={() => toggleAvailabilityDay(day)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        availability.includes(day) && styles.selectedDayText,
                      ]}
                    >
                      {day.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              mode="contained"
              onPress={handleUpdateProfile}
              style={[styles.saveButton, loading && styles.disabledButton]}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 16,
  },
  detailsSection: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardSection: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sportChip: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sportText: {
    color: "#fff",
    fontWeight: "500",
  },
  noDataText: {
    color: Colors.light.textSecondary,
    fontStyle: "italic",
  },
  input: {
    backgroundColor: "#f8f8f8",
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputContent: {
    backgroundColor: "#f8f8f8",
    color: Colors.light.text,
    fontSize: 16,
    paddingHorizontal: 12,
  },
  disabledInput: {
    opacity: 0.8,
    backgroundColor: "#f8f8f8",
    color: Colors.light.text,
  },
  label: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 5,
  },
  dayButton: {
    width: "31%",
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
  disabledButton: {
    backgroundColor: "#c4a8ff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.light.text,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  logoutText: {
    marginLeft: 4,
    color: Colors.light.primary,
    fontWeight: "500",
  },
});

export default ProfileScreen;
