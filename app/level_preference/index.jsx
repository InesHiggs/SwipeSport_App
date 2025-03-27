import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const LevelPreferencePage = () => {
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Define the available skill levels
  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Pro", "Expert"];

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
          setUserId(user.uid);
          const userRef = doc(FIRESTORE_DB, "users", user.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.levelPreference) {
              setSelectedLevels(userData.levelPreference);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };

    fetchUserPreferences();
  }, []);

  // Toggle the selection for a level
  const handleLevelSelection = (level) => {
    setSelectedLevels((prevState) => {
      if (prevState.includes(level)) {
        return prevState.filter((item) => item !== level); // Remove if already selected
      } else {
        return [...prevState, level]; // Add to selected levels
      }
    });
  };

  // Save the selected preferences to Firestore
  const handleSave = async () => {
    if (!userId || selectedLevels.length === 0) {
      alert("Please select at least one level preference.");
      return;
    }

    setIsLoading(true);
    try {
      const userRef = doc(FIRESTORE_DB, "users", userId);
      await updateDoc(userRef, {
        levelPreference: selectedLevels
      });
      
      console.log("Level preferences updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating level preferences:", error);
      alert("Failed to update preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/background.png")}
      style={styles.backgroundImage}
    >
      <ThemedView style={styles.container}>
        <View style={styles.headerContainer}>
          <MaterialIcons name="sports-tennis" size={40} color="#863f9c" />
          <ThemedText type="title" style={styles.title}>Level Preferences</ThemedText>
          <ThemedText style={styles.subtitle}>
            Select all skill levels you're willing to play with
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          {skillLevels.map((level) => (
            <Button
              key={level}
              mode="outlined"
              onPress={() => handleLevelSelection(level)}
              style={[
                styles.levelButton,
                selectedLevels.includes(level) && styles.selectedButton,
              ]}
              labelStyle={[
                styles.buttonLabel,
                selectedLevels.includes(level) && styles.selectedButtonLabel,
              ]}
            >
              {level}
              {selectedLevels.includes(level) && (
                <MaterialIcons name="check" size={18} color="#fff" style={styles.checkIcon} />
              )}
            </Button>
          ))}
        </View>

        <View style={styles.footerContainer}>
          <ThemedText style={styles.infoText}>
            This helps us find partners that match your playing preferences
          </ThemedText>
          <Button
            mode="contained"
            disabled={selectedLevels.length === 0 || isLoading}
            loading={isLoading}
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save Preferences
          </Button>
        </View>
      </ThemedView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    color: "#863f9c",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.8,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  levelButton: {
    marginVertical: 8,
    width: "90%",
    height: 50,
    justifyContent: "center",
    borderColor: "#c4a8ff",
    borderWidth: 1.5,
  },
  buttonLabel: {
    fontSize: 16,
    color: "#333",
  },
  selectedButton: {
    backgroundColor: "#863f9c",
    borderColor: "#7e22ce",
  },
  selectedButtonLabel: {
    color: "white",
    fontWeight: "bold",
  },
  checkIcon: {
    marginLeft: 8,
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  infoText: {
    textAlign: "center",
    marginBottom: 15,
    opacity: 0.7,
    fontSize: 14,
    paddingHorizontal: 20,
  },
  saveButton: {
    width: "90%",
    height: 50,
    justifyContent: "center",
    backgroundColor: "#863f9c",
  },
});

export default LevelPreferencePage;