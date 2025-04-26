import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Swiper from "react-native-deck-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function HomeScreen() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // New state variables for location
  const [locationName, setLocationName] = useState("Getting location...");
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  // Helper function to calculate common days
  const daysInCommon = (days1, days2) => {
    if (!Array.isArray(days1) || !Array.isArray(days2)) return 0;
    const set1 = new Set(days1);
    return days2.filter((day) => set1.has(day)).length;
  };

  // Get current location
  const getCurrentLocation = () => {
    setIsLocationLoading(true);
    setLocationName("Getting location...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Successfully got coordinates
          const { latitude, longitude } = position.coords;
          console.log("Current coordinates:", latitude, longitude);

          try {
            // Use reverse geocoding to get readable location
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();

            // Extract city or town name from the response
            const locationString =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.county ||
              "Unknown location";

            console.log("Location found:", locationString);
            setLocationName(locationString);

            // Save location to user profile if signed in
            if (FIREBASE_AUTH.currentUser) {
              const userRef = doc(
                FIREBASE_DB,
                "users",
                FIREBASE_AUTH.currentUser.uid
              );
              await updateDoc(userRef, {
                location: {
                  latitude,
                  longitude,
                  name: locationString,
                  lastUpdated: new Date().toISOString(),
                },
              });
            }
          } catch (error) {
            console.error("Error getting location name:", error);
            setLocationName("Current location");
          }

          setIsLocationLoading(false);
          setLocationError(false);
        },
        (error) => {
          // Error getting location
          console.error("Geolocation error:", error);
          setLocationName("Location unavailable");
          setIsLocationLoading(false);
          setLocationError(true);

          // Show error alert with option to retry
          Alert.alert(
            "Location Error",
            "Unable to get your current location. Please check your location permissions.",
            [
              { text: "OK" },
              { text: "Retry", onPress: () => getCurrentLocation() },
            ]
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } else {
      // Geolocation not supported
      console.error("Geolocation is not supported by this browser/device");
      setLocationName("Location unavailable");
      setIsLocationLoading(false);
      setLocationError(true);
      Alert.alert(
        "Error",
        "Location services are not available on your device"
      );
    }
  };

  // Get location on mount and load user data
  useEffect(() => {
    getCurrentLocation();

    const fetchData = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;

        if (user) {
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
          const userData = userDoc.data();

          if (userDoc.exists() && userData) {
            setCurrentUser(userData);

            // If user already has location saved, use it
            if (userData.location?.name) {
              setLocationName(userData.location.name);
              setIsLocationLoading(false);
            }

            const usersCollection = collection(FIREBASE_DB, "users");
            const usersSnapshot = await getDocs(query(usersCollection));

            // Filter users with the same sport interest
            const potentialMatches = usersSnapshot.docs
              .map((doc) => {
                const data = doc.data();
                return { ...data, id: doc.id };
              })
              .filter((match) => {
                return (
                  match.uid !== user.uid &&
                  match.sportName === userData.sportName
                );
              })
              .sort((a, b) => {
                const availA = a.userAvailability || a.availability || [];
                const availB = b.userAvailability || b.availability || [];
                const userAvail =
                  userData.userAvailability || userData.availability || [];

                return (
                  daysInCommon(userAvail, availB) -
                  daysInCommon(userAvail, availA)
                );
              });

            setUsers(potentialMatches);
          }
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle swipe actions
  const handleSwipe = (direction, swipedUser) => {
    if (direction === "right") {
      router.push(`/chats/${swipedUser.uid}`);
    }
  };

  // Calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    try {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();

      if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      return age;
    } catch (e) {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with location */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={getCurrentLocation}
        >
          <Ionicons name="location" size={24} color={Colors.light.primary} />
          {isLocationLoading ? (
            <ActivityIndicator
              size="small"
              color={Colors.light.primary}
              style={styles.locationLoader}
            />
          ) : (
            <Text
              style={[
                styles.locationText,
                locationError && styles.locationError,
              ]}
              numberOfLines={1}
            >
              {locationName}
            </Text>
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SwipeSport</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Swiper */}
      <View style={styles.swiperContainer}>
        {(() => {
          if (loading) {
            return (
              <ActivityIndicator size="large" color={Colors.light.primary} />
            );
          }

          if (users.length === 0) {
            return (
              <View style={styles.noMatchesContainer}>
                <Text style={styles.noMatchesText}>
                  No {currentUser?.sportName} players found
                </Text>
                <Text style={styles.noMatchesSubtext}>
                  We couldn't find any users who play {currentUser?.sportName}
                </Text>
              </View>
            );
          }

          return (
            <Swiper
              cards={users}
              renderCard={(card) => (
                <View style={styles.card}>
                  <Image
                    source={
                      card.photo
                        ? { uri: card.photo }
                        : require("../../assets/images/default-avatar.png")
                    }
                    style={styles.cardImage}
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={styles.cardGradient}
                  >
                    <View style={styles.cardDetails}>
                      <View style={styles.nameRow}>
                        <Text style={styles.cardName}>{card.name}</Text>
                        <Text style={styles.cardAge}>
                          {calculateAge(card.dateOfBirth)
                            ? `, ${calculateAge(card.dateOfBirth)}`
                            : ""}
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <View style={styles.infoPill}>
                          <Text style={styles.infoText}>
                            {card.sportName || currentUser.sportName}
                          </Text>
                        </View>
                        <View style={styles.infoPill}>
                          <Text style={styles.infoText}>
                            {card.proficiencyLevel || "No level"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.availabilityContainer}>
                        <Text style={styles.availabilityTitle}>
                          Available on:
                        </Text>
                        <View style={styles.daysRow}>
                          {card.userAvailability &&
                          card.userAvailability.length > 0 ? (
                            card.userAvailability.map((day) => (
                              <View key={day} style={styles.dayPill}>
                                <Text style={styles.dayText}>
                                  {day.substring(0, 3)}
                                </Text>
                              </View>
                            ))
                          ) : card.availability &&
                            card.availability.length > 0 ? (
                            card.availability.map((day) => (
                              <View key={day} style={styles.dayPill}>
                                <Text style={styles.dayText}>
                                  {day.substring(0, 3)}
                                </Text>
                              </View>
                            ))
                          ) : (
                            <Text style={styles.noAvailabilityText}>
                              No availability set
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              )}
              onSwipedRight={(index) => handleSwipe("right", users[index])}
              onSwipedLeft={(index) => handleSwipe("left", users[index])}
              backgroundColor="transparent"
              cardIndex={0}
              stackSize={3}
              verticalSwipe={false}
              containerStyle={styles.swiperContainerStyle}
              cardStyle={styles.cardStyle}
              cardVerticalMargin={0}
              cardHorizontalMargin={0}
              overlayLabels={{
                left: {
                  title: "NOPE",
                  style: {
                    label: styles.overlayLabel,
                    wrapper: styles.overlayWrapper,
                  },
                },
                right: {
                  title: "LIKE",
                  style: {
                    label: styles.overlayLabel,
                    wrapper: styles.overlayWrapper,
                  },
                },
              }}
              animateOverlayLabelsOpacity
              animateCardOpacity
              swipeBackCard
            />
          );
        })()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    maxWidth: "40%",
  },
  locationText: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
    maxWidth: 120,
  },
  locationError: {
    color: "#EF4444",
  },
  locationLoader: {
    marginLeft: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "PlayfairDisplay-Medium",
    color: Colors.light.primary,
  },
  placeholder: {
    width: 40,
  },
  swiperContainer: {
    flex: 1,
    position: "relative",
    paddingHorizontal: 40,
    paddingBottom: 40,
    paddingTop: 40,
  },
  swiperContainerStyle: {
    backgroundColor: "transparent",
  },
  cardStyle: {
    top: 0,
    width: "100%",
    height: "100%",
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: Dimensions.get("window").height - 220,
    marginTop: -20,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    padding: 20,
    justifyContent: "flex-end",
  },
  cardDetails: {
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  cardName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  cardAge: {
    fontSize: 22,
    color: "#fff",
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  infoPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
  },
  availabilityContainer: {
    marginTop: 10,
  },
  availabilityTitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  dayPill: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  dayText: {
    color: "#fff",
    fontSize: 12,
  },
  noAvailabilityText: {
    color: "#fff",
    fontSize: 12,
    fontStyle: "italic",
    opacity: 0.7,
  },
  overlayLabel: {
    fontSize: 25,
    fontWeight: "bold",
    padding: 10,
    color: "white",
  },
  overlayWrapper: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginTop: 30,
    marginLeft: -30,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noMatchesText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 12,
  },
  noMatchesSubtext: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
});
