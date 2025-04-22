import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { useState } from "react";
import { ThemedText } from "../../components/ThemedText";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { FIREBASE_AUTH } from "@/FirebaseConfig";

const playerLevels = [
  {
    level: "Beginner",
    icon: "walk-outline",
    description: "Play with beginners",
  },
  {
    level: "Intermediate 1",
    icon: "walk",
    description: "Play with intermediate 1 players",
  },
  {
    level: "Intermediate 2",
    icon: "bicycle-outline",
    description: "Play with intermediate 2 players",
  },
  {
    level: "Advanced",
    icon: "bicycle",
    description: "Play with advanced players",
  },
  {
    level: "Pro",
    icon: "trophy-outline",
    description: "Play with pro players",
  },
] as const;

export default function SignUpPreference() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedLevel, setSelectedLevel] = useState("");
  const [error, setError] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleComplete = async () => {
    if (!selectedLevel) {
      setError("Please select your preferred player level");
      return;
    }

    try {
      // Your Firebase logic here
      router.replace("/");
    } catch (error) {
      setError("An error occurred");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <ThemedText style={styles.title}>One last thing!</ThemedText>
        <ThemedText style={styles.subtitle}>
          Select the level of players you want to play with
        </ThemedText>

        <View style={styles.levelContainer}>
          {playerLevels.map(({ level, icon }) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                selectedLevel === level && styles.selectedLevel,
              ]}
              onPress={() => setSelectedLevel(level)}
            >
              <Ionicons
                name={icon as any}
                size={24}
                color={Colors.light.text}
              />
              <ThemedText
                style={[
                  styles.levelText,
                  selectedLevel === level && styles.selectedLevelText,
                ]}
              >
                {level}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.completeButton, !selectedLevel && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={!selectedLevel}
      >
        <ThemedText style={styles.buttonText}>Complete</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
  },
  title: {
    fontSize: 32,
    fontFamily: "PlayfairDisplay-Medium",
    color: Colors.light.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  levelContainer: {
    gap: 12,
    marginBottom: 32,
  },
  levelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#fff",
  },
  selectedLevel: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
  },
  levelText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedLevelText: {
    fontWeight: "500",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 16,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  completeButton: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 34 : 24,
    right: 24,
    height: 50,
    width: 100,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
