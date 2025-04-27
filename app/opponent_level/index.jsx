import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaterialButton from '@/components/MaterialButton';
import { AppStyles } from '@/constants/AppStyles';
import { MaterialIcons } from "@expo/vector-icons";

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
    <ThemedView useMaterialBackground style={styles.container}>
      {/* Background image */}
      <Image 
        source={require('@/assets/images/bg.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />
      
      <ThemedText useMaterialStyle type="headlineMedium" style={styles.title}>
        Opponent's Tennis Skill Level
      </ThemedText>
      
      <ThemedText useMaterialStyle type="bodyLarge" style={styles.subtitle}>
        Please select your opponent's level
      </ThemedText>

      <View style={styles.buttonContainer}>
        {opponentLevels.map((level, index) => (
          <MaterialButton
            key={index}
            title={level}
            variant={selectedOpponentLevels.includes(level) ? "filled" : "outlined"}
            onPress={() => handleSelection(level)}
            style={styles.button}
            leftIcon={
              selectedOpponentLevels.includes(level) ? (
                <MaterialIcons name="check" size={18} color={AppStyles.Colors.onPrimary} />
              ) : null
            }
          />
        ))}
      </View>

      {/* Done Button to navigate back to the Home screen */}
      <MaterialButton
        title="Done"
        variant="filled"
        onPress={() => router.push('/')}
        style={styles.doneButton}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: AppStyles.Spacing.l,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    zIndex: -1,
  },
  title: {
    marginBottom: AppStyles.Spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: AppStyles.Spacing.l,
    textAlign: 'center',
    color: AppStyles.Colors.onSurfaceVariant,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: AppStyles.Spacing.s,
  },
  button: {
    marginVertical: AppStyles.Spacing.xs,
    width: "80%",
  },
  doneButton: {
    marginTop: AppStyles.Spacing.xl,
    width: "80%",
  },
});

export default OpponentLevelPage;
