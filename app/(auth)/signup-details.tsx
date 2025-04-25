import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ThemedText } from "../../components/ThemedText";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const proficiencyData = [
  { level: "Beginner", icon: "walk-outline" },
  { level: "Intermediate 1", icon: "walk" },
  { level: "Intermediate 2", icon: "bicycle-outline" },
  { level: "Advanced", icon: "bicycle" },
  { level: "Pro", icon: "trophy-outline" },
] as const;

export default function SignUpDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [error, setError] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (!name || !proficiency) {
      setError("Please fill in all fields");
      return;
    }

    console.log("signup-details received params:", params); // Debug log
    console.log("signup-details sending params:", {
      ...params,
      name,
      proficiency,
    }); // Debug log

    router.push({
      pathname: "/(auth)/signup-personal",
      params: {
        ...params, // Include ALL previous params
        name,
        proficiency,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <ThemedText style={styles.title}>Tell us about yourself!</ThemedText>
        <ThemedText style={styles.subtitle}></ThemedText>
        <ThemedText style={styles.label}>Full Name</ThemedText>
        <TextInput
          value={name}
          style={styles.input}
          placeholder="Enter your preferred name"
          placeholderTextColor={Colors.light.placeholder}
          autoCapitalize="words"
          onChangeText={setName}
        />
        <ThemedText style={styles.label}>
          What is your proficiency in {params.sportName}?
        </ThemedText>
        <View style={styles.proficiencyContainer}>
          {proficiencyData.map(({ level, icon }) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.proficiencyButton,
                proficiency === level && styles.selectedProficiency,
              ]}
              onPress={() => setProficiency(level)}
            >
              <Ionicons
                name={icon as any}
                size={24}
                color={proficiency === level ? "#000000" : Colors.light.text}
              />
              <ThemedText
                style={[
                  styles.proficiencyText,
                  proficiency === level && styles.selectedProficiencyText,
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

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          (!name || !proficiency) && styles.buttonDisabled,
        ]}
        onPress={handleNext}
        disabled={!name || !proficiency}
      >
        <ThemedText style={styles.buttonText}>Next</ThemedText>
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
    paddingTop: 64, // Add space for back button
    justifyContent: "center",
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
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderColor: "#E2E8F0",
    fontSize: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
    fontWeight: "500",
  },
  proficiencyContainer: {
    gap: 12,
    marginBottom: 32,
  },
  proficiencyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#fff",
  },
  selectedProficiency: {
    borderColor: Colors.light.primary,
    borderWidth: 2,
    backgroundColor: "#fff", // Keep background white
  },
  proficiencyText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedProficiencyText: {
    fontWeight: "500", // Make text bolder instead of changing color
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  nextButton: {
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
