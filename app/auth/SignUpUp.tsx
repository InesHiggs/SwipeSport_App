import { useRouter } from "expo-router";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { ThemedText } from "../../components/ThemedText";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";

const sportsEmojis = [
  "⚽️",
  "🏀",
  "🎾",
  "🏈",
  "🏉",
  "🏸",
  "🏏",
  "🎱",
  "🏓",
  "🏑",
  "⛳️",
  "🏊‍♂️",
  "🏃‍♂️",
  "🚴‍♂️",
  "🤾‍♂️",
  "🏋️‍♂️",
];

type SportsMap = {
  [key: string]: string;
};

const sportsMapping: SportsMap = {
  "⚽️": "Football",
  "🏀": "Basketball",
  "🎾": "Tennis",
  "🏈": "American Football",
  "🏉": "Rugby",
  "🏸": "Badminton",
  "🏏": "Cricket",
  "🎱": "Pool",
  "🏓": "Table Tennis",
  "🏑": "Hockey",
  "⛳️": "Golf",
  "🏊‍♂️": "Swimming",
  "🏃‍♂️": "Running",
  "🚴‍♂️": "Cycling",
  "🤾‍♂️": "Handball",
  "🏋️‍♂️": "Weight Lifting",
};

const validEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "zoho.com",
];

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isValidEmail = (email: string): boolean => {
    const domain = email.split("@")[1]?.toLowerCase();
    return domain ? validEmailDomains.includes(domain) : false;
  };

  const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleNext = () => {
    let hasError = false;
    setEmailError("");
    setPasswordError("");
    setError("");

    if (!email || !selectedSport || !password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!isValidPassword(password)) {
      setPasswordError(
        "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number"
      );
      hasError = true;
    }

    if (!hasError) {
      console.log("SignUpUp params:", { email, password }); // Debug log

      router.push({
        pathname: "/auth/signup-details",
        params: {
          email,
          password, // Make sure password is included
          sport: selectedSport,
          sportName: sportsMapping[selectedSport],
        },
      });
    }
  };

  const handleSportSelection = (emoji: string) => {
    setSelectedSport(emoji);
    setError("");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
      </TouchableOpacity>

      <View style={[styles.content, { paddingTop: 64 }]}>
        <View style={styles.brandContainer}>
          <ThemedText style={styles.brandName}>SwipeSport</ThemedText>
          <ThemedText style={styles.brandTagline}>
            Find. Match. Play.
          </ThemedText>
        </View>

        <View style={styles.sportSelectionContainer}>
          <ThemedText style={styles.sportSelectionText}>
            {selectedSport
              ? `You have chosen ${sportsMapping[selectedSport]}`
              : "Choose a sport"}
          </ThemedText>
        </View>

        <View style={styles.emojiGrid}>
          {sportsEmojis.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={styles.emojiContainer}
              onPress={() => handleSportSelection(emoji)}
            >
              <ThemedText
                style={[
                  styles.emoji,
                  selectedSport === emoji && styles.selectedEmoji,
                ]}
              >
                {emoji}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.welcomeContainer}>
          <ThemedText style={styles.title}>Welcome!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Please enter email to get started
          </ThemedText>
        </View>

        <TextInput
          value={email}
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="University email"
          placeholderTextColor={Colors.light.placeholder}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(text) => {
            setEmail(text);
            setEmailError("");
            setError("");
          }}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            value={password}
            style={[
              styles.input,
              passwordError ? styles.inputError : null,
              { flex: 1, marginBottom: 0 },
            ]}
            placeholder="Password"
            placeholderTextColor={Colors.light.placeholder}
            secureTextEntry={!showPassword}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
              setError("");
            }}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color={Colors.light.text}
            />
          </TouchableOpacity>
        </View>

        {(emailError || passwordError || error) && (
          <ThemedText style={styles.errorText}>
            {error || emailError || passwordError}
          </ThemedText>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            (!email || !selectedSport || !password) && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={!email || !selectedSport || !password}
        >
          <ThemedText style={styles.buttonText}>Next</ThemedText>
        </TouchableOpacity>
      </View>
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
    justifyContent: "center",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 24,
  },
  brandName: {
    textAlign: "center",
    color: Colors.light.primary,
    fontSize: 48,
    fontFamily: "PlayfairDisplay-Medium",
    fontWeight: "500",
    marginBottom: 16,
  },
  brandTagline: {
    fontSize: 20,
    color: Colors.light.textSecondary,
    marginTop: 8,
    lineHeight: 32,
  },
  sportSelectionContainer: {
    alignItems: "center",
  },
  sportSelectionText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 24,
    width: "60%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 3,
  },
  emojiContainer: {
    width: "25%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  emoji: {
    fontSize: 32,
  },
  selectedEmoji: {
    transform: [{ scale: 1.2 }],
    textShadowColor: Colors.light.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    backgroundColor: "rgba(167, 223, 48, 0.1)",
    borderRadius: 8,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    color: Colors.light.primary,
    fontSize: 24,
    fontFamily: "PlayfairDisplay-Medium",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "center",
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
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: -16,
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    height: 50,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    height: 50,
    justifyContent: "center",
  },
});
