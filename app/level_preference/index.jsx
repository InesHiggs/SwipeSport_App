import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import MaterialButton from "@/components/MaterialButton";
import { AppStyles } from "@/constants/AppStyles";

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
    <ThemedView useMaterialBackground style={styles.container}>
      {/* Background image */}
      <Image 
        source={require('@/assets/images/bg.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />

      <View style={styles.headerContainer}>
        <MaterialIcons name="sports-tennis" size={40} color={AppStyles.Colors.primary} />
        <ThemedText useMaterialStyle type="headlineMedium" style={styles.title}>
          Level Preferences
        </ThemedText>
        <ThemedText useMaterialStyle type="bodyLarge" style={styles.subtitle}>
          Select all skill levels you're willing to play with
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        {skillLevels.map((level) => (
          <MaterialButton
            key={level}
            title={level}
            variant={selectedLevels.includes(level) ? "filled" : "outlined"}
            onPress={() => handleLevelSelection(level)}
            style={styles.levelButton}
            leftIcon={
              selectedLevels.includes(level) ? (
                <MaterialIcons name="check" size={18} color={AppStyles.Colors.onPrimary} />
              ) : null
            }
          />
        ))}
      </View>

      <View style={styles.footerContainer}>
        <ThemedText useMaterialStyle type="bodyMedium" style={styles.infoText}>
          This helps us find partners that match your playing preferences
        </ThemedText>
        <MaterialButton
          title="Save Preferences"
          disabled={selectedLevels.length === 0 || isLoading}
          loading={isLoading}
          onPress={handleSave}
          style={styles.saveButton}
          fullWidth
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: AppStyles.Spacing.l,
    justifyContent: "space-between",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    zIndex: -1,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: AppStyles.Spacing.l,
  },
  title: {
    marginTop: AppStyles.Spacing.s,
    textAlign: "center",
  },
  subtitle: {
    marginTop: AppStyles.Spacing.xs,
    marginBottom: AppStyles.Spacing.l,
    textAlign: "center",
    color: AppStyles.Colors.onSurfaceVariant,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: AppStyles.Spacing.l,
  },
  levelButton: {
    marginVertical: AppStyles.Spacing.xs,
    width: "100%",
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: AppStyles.Spacing.xl,
  },
  infoText: {
    textAlign: "center",
    marginBottom: AppStyles.Spacing.m,
    color: AppStyles.Colors.onSurfaceVariant,
    paddingHorizontal: AppStyles.Spacing.l,
  },
  saveButton: {
    marginTop: AppStyles.Spacing.s,
  },
});

export default LevelPreferencePage;