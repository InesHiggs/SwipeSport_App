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
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
        const userRef = doc(FIREBASE_DB, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("COMPLETE USER DATA:", JSON.stringify(userData, null, 2));

          // Try both field names (for backward compatibility)
          const availabilityData =
            userData.userAvailability || userData.availability || [];
          console.log("Availability data:", availabilityData);

          // Make sure these field names match exactly with your signup form
          setName(userData.name || "");

          // Calculate age from dateOfBirth if available
          if (userData.dateOfBirth) {
            const birthDate = new Date(userData.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            if (
              today.getMonth() < birthDate.getMonth() ||
              (today.getMonth() === birthDate.getMonth() &&
                today.getDate() < birthDate.getDate())
            ) {
              age--;
            }
            setAge(age.toString());
          }

          setGender(userData.gender || "");

          setSports(userData.sportName ? [userData.sportName] : []);

          setProficiencyLevel(userData.proficiencyLevel || "");

          setAvailability(
            Array.isArray(availabilityData) ? availabilityData : []
          );

          console.log(
            "Image URL from database:",
            userData.photo || userData.photoURL || "No image URL found"
          );

          const imageUrl = userData.photo || userData.photoURL;
          if (imageUrl) {
            console.log("Setting image with URL:", imageUrl);
            setImage(imageUrl);
          } else {
            setImage(null);
          }
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
      quality: 0.8,
    });

    if (!result.canceled) {
      console.log("Selected image URI:", result.assets[0].uri);
      setImage(result.assets[0].uri);
      setHasUnsavedChanges(true);
      Alert.alert(
        "Image Selected",
        "Don't forget to save changes to update your profile picture!"
      );
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setLoading(true);

      // Handle image upload first if needed
      let newImageUrl = null;
      if (image && image.startsWith("file://")) {
        try {
          console.log("Uploading image to Firebase Storage");
          const storage = getStorage();
          // Create a unique file path to avoid caching issues
          const imageRef = ref(
            storage,
            `profile_pictures/${userId}_${Date.now()}`
          );

          const response = await fetch(image);
          const blob = await response.blob();

          // Upload the image
          await uploadBytes(imageRef, blob);

          // Get download URL
          newImageUrl = await getDownloadURL(imageRef);
          console.log("Upload successful, new image URL:", newImageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
          Alert.alert("Error", "Failed to upload profile picture");
          setLoading(false);
          return;
        }
      }

      // Save all profile data at once
      const userRef = doc(FIREBASE_DB, "users", userId);

      const updates = {
        userAvailability: availability,
        lastUpdated: new Date().toISOString(),
      };

      // Only add the image fields if we have a new image
      if (newImageUrl) {
        updates.photo = newImageUrl;
        updates.photoURL = newImageUrl;
        // Update local state with the new URL
        setImage(newImageUrl);
      }

      await updateDoc(userRef, updates);

      // Verify the data was saved
      const verifyDoc = await getDoc(userRef);
      if (verifyDoc.exists()) {
        console.log(
          "Verified data:",
          JSON.stringify(verifyDoc.data(), null, 2)
        );
      }

      Alert.alert("Success", "Profile updated successfully!");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailabilityDay = (day) => {
    setAvailability((prevAvailability) => {
      const newAvailability = prevAvailability.includes(day)
        ? prevAvailability.filter((d) => d !== day)
        : [...prevAvailability, day];

      // Set the unsaved changes flag when a day is toggled
      setHasUnsavedChanges(true);
      return newAvailability;
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
                {loading && image && image.startsWith("file://") ? (
                  <ActivityIndicator
                    size="large"
                    color={Colors.light.primary}
                  />
                ) : (
                  <Image
                    key={image || "default"} // Key to force re-render
                    source={
                      image
                        ? { uri: image }
                        : require("../../assets/images/default-avatar.png")
                    }
                    style={styles.profilePic}
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editIconContainer}
                onPress={pickImage}
              >
                <MaterialIcons name="edit" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* User Details Section */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              {/* Name field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.displayField}>
                  <Text style={styles.displayText}>
                    {name || "Not provided"}
                  </Text>
                </View>
              </View>

              {/* Age field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.displayField}>
                  <Text style={styles.displayText}>
                    {age || "Not provided"}
                  </Text>
                </View>
              </View>

              {/* Gender field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.displayField}>
                  <Text style={styles.displayText}>
                    {gender || "Not provided"}
                  </Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Sports Interests</Text>
                <View style={styles.sportsContainer}>
                  {sports && sports.length > 0 ? (
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

              {/* Proficiency Level field */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Proficiency Level</Text>
                <View style={styles.displayField}>
                  <Text style={styles.displayText}>
                    {proficiencyLevel || "Not provided"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Availability Section */}
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

            {hasUnsavedChanges && (
              <Text style={styles.unsavedChangesText}>
                Don't forget to save your changes!
              </Text>
            )}

            <Button
              mode="contained"
              onPress={handleUpdateProfile}
              style={[
                styles.saveButton,
                loading && styles.disabledButton,
                hasUnsavedChanges && styles.saveButtonHighlight,
              ]}
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
    position: "relative",
  },
  profilePicWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: Colors.light.primary,
    overflow: "hidden", // Critical for the circular crop
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    width: 120,
    height: 120,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: Colors.light.primary,
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
    marginRight: "5%",
    marginBottom: "0%",
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
  displayField: {
    backgroundColor: "#f8f8f8",
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  displayText: {
    fontSize: 16,
    color: Colors.light.text,
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
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
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
    backgroundColor: Colors.light.primary,
  },
  disabledButton: {
    backgroundColor: "#c4a8ff",
  },
  saveButtonHighlight: {
    backgroundColor: "#ff8c00",
    elevation: 4,
  },
  unsavedChangesText: {
    color: "#ff6347",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
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
