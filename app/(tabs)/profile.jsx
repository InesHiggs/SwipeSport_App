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
import { Button, Provider } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { Colors } from "../../constants/Colors";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase profile image helper component built directly into this file
const FirebaseProfileImage = ({ userId, style, defaultImage }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [debugMessage, setDebugMessage] = useState(
    "Initializing image fetch..."
  );

  useEffect(() => {
    const fetchFreshImageUrl = async () => {
      if (!userId) {
        console.log("No userId provided for image fetch");
        setDebugMessage("No userId provided");
        setLoading(false);
        return;
      }

      try {
        console.log(
          `Attempting to fetch image for userId: ${userId} (attempt ${
            loadAttempts + 1
          })`
        );
        setDebugMessage(`Fetching image (attempt ${loadAttempts + 1})...`);
        setLoading(true);

        const storage = getStorage();
        const imageRef = ref(storage, `profile_images/${userId}`);

        // Try to get the download URL (this may throw if not found or due to network issues)
        const url = await getDownloadURL(imageRef);
        console.log("✅ Success! Firebase image URL fetched:", url);
        setImageUrl(url);
        setDebugMessage("Image successfully fetched!");
        setError(false);
      } catch (err) {
        if (err.code === "storage/object-not-found") {
          console.log(
            "❌ Image not found in Firebase Storage - no profile picture has been uploaded yet"
          );
          setDebugMessage("No profile picture has been uploaded yet.");
        } else if (err.code === "storage/retry-limit-exceeded") {
          console.error(
            "❌ Firebase image fetch error:",
            err.code,
            err.message
          );
          setDebugMessage(
            "Retry limit exceeded. Something is taking too long or your network may be slow."
          );
        } else {
          console.error(
            "❌ Firebase image fetch error:",
            err.code,
            err.message
          );
          setDebugMessage(`Error: ${err.code} - ${err.message}`);
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFreshImageUrl();
  }, [userId, loadAttempts]);

  // Display a loading spinner with the debug message while loading
  if (loading) {
    return (
      <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={{ fontSize: 10, marginTop: 5, color: "#666" }}>
          {debugMessage}
        </Text>
      </View>
    );
  }

  // If error or no URL available, show default image with a retry overlay that displays the debug message
  if (error || !imageUrl) {
    return (
      <TouchableOpacity
        style={[{ justifyContent: "center", alignItems: "center" }, style]}
        onPress={() => setLoadAttempts((prev) => prev + 1)}
      >
        <Image source={defaultImage} style={style} resizeMode="cover" />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            width: "100%",
            padding: 3,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10, textAlign: "center" }}>
            {debugMessage} {"\n"}Tap to retry
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Lastly, if we have a valid URL, render the image with onLoad and onError logging
  return (
    <Image
      source={{ uri: imageUrl }}
      style={style}
      resizeMode="cover"
      onLoadStart={() => {
        console.log("Image loading started:", imageUrl);
        setDebugMessage("Image loading started...");
      }}
      onLoad={() => {
        console.log("Image loaded successfully");
        setDebugMessage("Image loaded successfully");
      }}
      onError={(e) => {
        console.log("Image load error:", e.nativeEvent.error);
        setDebugMessage(`Image load error: ${e.nativeEvent.error}`);
        setError(true);
      }}
    />
  );
};

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [sports, setSports] = useState([]);
  const [proficiencyLevel, setProficiencyLevel] = useState("");
  const [availability, setAvailability] = useState([]);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLocalImage, setIsLocalImage] = useState(false);

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

          // Try both field names for availability
          const availabilityData =
            userData.userAvailability || userData.availability || [];

          // Set user data
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

          // For image handling, just note if we have a Firebase image
          // We'll load it using the FirebaseProfileImage component
          const imageUrl = userData.photo || userData.photoURL;
          if (imageUrl && !imageUrl.startsWith("file://")) {
            // This indicates we have an image in Firebase, but we'll load it fresh
            setIsLocalImage(false);
          } else if (imageUrl && imageUrl.startsWith("file://")) {
            // This is a local image that hasn't been uploaded yet
            setIsLocalImage(true);
            setImage(imageUrl);
          } else {
            setIsLocalImage(false);
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
      setIsLocalImage(true);
      setHasUnsavedChanges(true);
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
          const imageRef = ref(storage, `profile_images/${userId}`);

          const response = await fetch(image);
          const blob = await response.blob();

          // Upload the image with metadata that prevents caching
          await uploadBytes(imageRef, blob, {
            contentType: "image/jpeg",
            customMetadata: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          });

          // Get download URL
          newImageUrl = await getDownloadURL(imageRef);
          console.log("Upload successful, new image URL:", newImageUrl);

          // After successful upload, we're no longer using a local image
          setIsLocalImage(false);
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
      }

      await updateDoc(userRef, updates);

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
            <View style={styles.profileContainer}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.profilePicWrapper}
              >
                {loading && isLocalImage ? (
                  <ActivityIndicator
                    size="large"
                    color={Colors.light.primary}
                  />
                ) : isLocalImage ? (
                  // This branch is for a newly selected local image.
                  <Image
                    source={{ uri: image }}
                    style={styles.profilePic}
                    resizeMode="cover"
                  />
                ) : (
                  // This branch uses the FirebaseProfileImage to fetch the remote image.
                  <FirebaseProfileImage
                    userId={userId}
                    style={styles.profilePic}
                    defaultImage={require("../../assets/images/default-avatar.png")}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: 10,
                  alignItems: "center",
                  marginVertical: 10,
                  borderRadius: 5,
                }}
                onPress={async () => {
                  try {
                    const storage = getStorage();
                    const imageRef = ref(storage, `profile_images/${userId}`);

                    // Check if image exists
                    try {
                      const url = await getDownloadURL(imageRef);
                      Alert.alert(
                        "Profile Image Status",
                        `Image exists at path: profile_images/${userId}\n\nURL: ${url.substring(
                          0,
                          50
                        )}...`
                      );
                    } catch (err) {
                      if (err.code === "storage/object-not-found") {
                        Alert.alert(
                          "Profile Image Status",
                          "No image found at this path. You need to upload a profile picture first."
                        );
                      } else {
                        Alert.alert(
                          "Error",
                          `Failed to check image: ${err.message}`
                        );
                      }
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                <Text style={{ color: Colors.light.textSecondary }}>
                  Debug: Check Image Status
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editIconContainer}
                onPress={pickImage}
              >
                <MaterialIcons name="edit" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Rest of profile UI */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <View style={styles.displayField}>
                  <Text style={styles.displayText}>
                    {name || "Not provided"}
                  </Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.displayField}>
                  <Text style={styles.displayText}>
                    {age || "Not provided"}
                  </Text>
                </View>
              </View>

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

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Proficiency Level</Text>
                <View style={styles.displayField}>
                  <Text style={styles.displayText}>
                    {proficiencyLevel || "Not provided"}
                  </Text>
                </View>
              </View>
            </View>

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
    backgroundColor: "#fff",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
    marginBottom: 30,
    position: "relative",
  },
  profilePicWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: Colors.light.primary,
    overflow: "hidden",
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
    right: "50%",
    marginRight: -100,
    backgroundColor: Colors.light.primary,
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 20,
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
