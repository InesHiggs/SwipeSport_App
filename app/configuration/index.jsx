import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

const ConfigurationScreen = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const router = useRouter();

  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Professional", "Expert"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tennis Skill Level</Text>
      <Text style={styles.subtitle}>Please select your level</Text>

      <View style={styles.buttonContainer}>
        {skillLevels.map((level, index) => (
          <Button
            key={index}
            mode="contained"
            onPress={() => setSelectedLevel(level)}
            style={[
              styles.button,
              selectedLevel === level && styles.selectedButton,
            ]}
          >
            {level}
          </Button>
        ))}
      </View>

      <Button
        mode="outlined"
        style={styles.oppLevelButton}
        onPress={() => router.push("/opponent_level")}
      >
        Opponent's Level
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginVertical: 5,
    width: "80%",
  },
  selectedButton: {
    backgroundColor: "#6200ee", // Highlight color when selected
  },
  oppLevelButton: {
    marginTop: 20,
    width: "80%",
  },
});

export default ConfigurationScreen;
