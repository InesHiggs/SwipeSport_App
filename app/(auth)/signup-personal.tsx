import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  TextInput,
  Image,
} from "react-native";
import { useState } from "react";
import { ThemedText } from "../../components/ThemedText";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const genderOptions = [
  "Male",
  "Female",
  "Non-binary",
  "Other",
  "Prefer not to say",
];

export default function SignUpPersonal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [photo, setPhoto] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [dateInput, setDateInput] = useState("");
  const [gender, setGender] = useState<string>("");
  const [error, setError] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (!dateOfBirth || !gender) {
      setError("Please fill in all required fields");
      return;
    }

    console.log("signup-personal received params:", params); // Debug log
    console.log("signup-personal sending params:", {
      ...params,
      dateOfBirth: dateOfBirth?.toISOString(),
      gender,
      photo,
    }); // Debug log

    router.push({
      pathname: "/(auth)/signup-preference",
      params: {
        ...params, // Include ALL previous params
        dateOfBirth: dateOfBirth?.toISOString(),
        gender,
        photo,
      },
    });
  };

  const handleAddPhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        setError("Permission to access gallery was denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        setPhoto(result.assets[0].uri);
        setError("");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setError("Error selecting image");
    }
  };

  const formatDateInput = (input: string) => {
    // Remove any non-numeric characters
    const numbers = input.replace(/\D/g, "");

    // Add slashes after MM and DD
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4)
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(
      4,
      8
    )}`;
  };

  const validateMonth = (month: number): boolean => {
    if (month < 1 || month > 12) {
      setError("Please enter a valid month (01-12)");
      setDateOfBirth(null);
      return false;
    }
    return true;
  };

  const validateDay = (day: number, daysInMonth: number): boolean => {
    if (day < 1 || day > daysInMonth) {
      setError(`Please enter a valid day (1-${daysInMonth})`);
      setDateOfBirth(null);
      return false;
    }
    return true;
  };

  const validateYear = (inputDate: Date): boolean => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100); // Max age 100 years
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 13); // Min age 13 years

    if (inputDate > today) {
      setError("Date cannot be in the future");
      setDateOfBirth(null);
      return false;
    }

    if (inputDate > maxDate) {
      setError("You must be at least 13 years old");
      setDateOfBirth(null);
      return false;
    }

    if (inputDate < minDate) {
      setError("Please enter a valid date");
      setDateOfBirth(null);
      return false;
    }

    return true;
  };

  const handleDateChange = (text: string) => {
    const numbers = text.replace(/[^\d]/g, "");

    if (numbers.length <= 8) {
      const formatted = formatDateInput(numbers);
      setDateInput(formatted);

      if (numbers.length === 8) {
        const month = Number(numbers.slice(0, 2));
        const day = Number(numbers.slice(2, 4));
        const year = Number(numbers.slice(4, 8));

        if (!validateMonth(month)) return;

        const daysInMonth = new Date(year, month, 0).getDate();
        if (!validateDay(day, daysInMonth)) return;

        const inputDate = new Date(year, month - 1, day);
        if (!validateYear(inputDate)) return;

        // If all validations pass
        setDateOfBirth(inputDate);
        setError("");
      } else {
        setDateOfBirth(null);
        setError("");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Photo Upload */}
        <View style={styles.photoContainer}>
          <TouchableOpacity
            style={[
              styles.addPhotoButton,
              photo ? styles.photoButtonWithImage : null,
            ]}
            onPress={handleAddPhoto}
          >
            {photo ? (
              <Image
                source={{ uri: photo }}
                style={styles.photoPreview}
                resizeMode="cover"
              />
            ) : (
              <>
                <Ionicons
                  name="camera-outline"
                  size={40}
                  color={Colors.light.primary}
                />
                <ThemedText style={styles.addPhotoText}>Add photo</ThemedText>
              </>
            )}
          </TouchableOpacity>
          {photo && (
            <TouchableOpacity onPress={handleAddPhoto}>
              <ThemedText style={styles.changePhotoText}>
                Change photo
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Date of Birth */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.fieldTitle}>When were you born?</ThemedText>
          <TextInput
            style={styles.dateInput}
            value={dateInput}
            onChangeText={handleDateChange}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={Colors.light.placeholder}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        {/* Gender Selection */}
        <View style={styles.fieldContainer}>
          <ThemedText style={styles.fieldTitle}>
            What is your gender?
          </ThemedText>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
              mode="dropdown"
              dropdownIconColor={Colors.light.text}
            >
              <Picker.Item
                label="Select gender"
                value=""
                style={styles.placeholderItem}
                color={Colors.light.placeholder}
              />
              {genderOptions.map((option) => (
                <Picker.Item
                  key={option}
                  label={option}
                  value={option}
                  style={styles.pickerItem}
                  color={Colors.light.text}
                />
              ))}
            </Picker>
          </View>
        </View>

        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          (!dateOfBirth || !gender) && styles.buttonDisabled,
        ]}
        onPress={handleNext}
        disabled={!dateOfBirth || !gender}
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
    paddingTop: 64,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  addPhotoButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden", // This ensures the image stays within the circular boundary
  },
  photoButtonWithImage: {
    borderStyle: "solid",
    borderColor: Colors.light.primary,
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  addPhotoText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  changePhotoText: {
    color: Colors.light.primary,
    fontSize: 16,
    marginTop: 8,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldTitle: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 12,
    fontWeight: "500",
  },
  dateInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E2E8F0",
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    letterSpacing: 1, // Add slight spacing for better readability
  },
  pickerContainer: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E2E8F0",
    backgroundColor: "#fff",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: 8,
  },
  picker: {
    height: 50,
    width: "100%",
    color: Colors.light.text,
    backgroundColor: "transparent",
    marginLeft: Platform.OS === "android" ? -8 : 0,
    marginRight: Platform.OS === "android" ? -8 : 0,
  },
  pickerItem: {
    fontSize: 16,
    color: Colors.light.text,
  },
  placeholderItem: {
    fontSize: 16,
    color: Colors.light.placeholder,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 8,
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
