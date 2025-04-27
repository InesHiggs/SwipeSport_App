import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import MaterialButton from '@/components/MaterialButton';
import { AppStyles } from '@/constants/AppStyles';
import { MaterialIcons } from "@expo/vector-icons";

const ConfigurationScreen = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const router = useRouter();

  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Professional", "Expert"];

  return (
    <ThemedView useMaterialBackground style={styles.container}>
      {/* Background image */}
      <Image 
        source={require('@/assets/images/bg.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />
      
      <ThemedText useMaterialStyle type="headlineMedium" style={styles.title}>
        Tennis Skill Level
      </ThemedText>
      
      <ThemedText useMaterialStyle type="bodyLarge" style={styles.subtitle}>
        Please select your level
      </ThemedText>

      <View style={styles.buttonContainer}>
        {skillLevels.map((level, index) => (
          <MaterialButton
            key={index}
            title={level}
            variant={selectedLevel === level ? "filled" : "outlined"}
            onPress={() => setSelectedLevel(level)}
            style={styles.button}
            leftIcon={
              selectedLevel === level ? (
                <MaterialIcons name="check" size={18} color={AppStyles.Colors.onPrimary} />
              ) : null
            }
          />
        ))}
      </View>

      <MaterialButton
        title="Opponent's Level"
        variant="outlined"
        onPress={() => router.push("/opponent_level")}
        style={styles.oppLevelButton}
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
  oppLevelButton: {
    marginTop: AppStyles.Spacing.xl,
    width: "80%",
  },
});

export default ConfigurationScreen;
