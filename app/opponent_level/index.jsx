import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

const OpponentLevelPage = () => {
  const [selectedOpponentLevels, setSelectedOpponentLevels] = useState([]);
  const router = useRouter();

  // Define the available levels for the opponent
  const opponentLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Professional",
    "Expert",
  ];

  // Toggle the selection for an opponent's level
  const handleSelection = (level) => {
    setSelectedOpponentLevels((prevState) => {
      if (prevState.includes(level)) {
        return prevState.filter((item) => item !== level); // Remove if already selected
      } else {
        return [...prevState, level]; // Add to selected levels
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opponent's Tennis Skill Level</Text>
      <Text style={styles.subtitle}>Please select your opponent's level</Text>

      <View style={styles.buttonContainer}>
        {opponentLevels.map((level, index) => (
          <Button
            key={index}
            mode="outlined"
            onPress={() => handleSelection(level)}
            style={[
              styles.button,
              selectedOpponentLevels.includes(level) && styles.selectedButton,
            ]}
          >
            {level}
          </Button>
        ))}
      </View>

      {/* Done Button to navigate back to the Home screen */}
      <Button
        mode="contained"
        style={styles.doneButton}
        onPress={() => router.push('/')}
      >
        Done
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
  doneButton: {
    marginTop: 20,
    width: "80%",
  },
});

export default OpponentLevelPage;
