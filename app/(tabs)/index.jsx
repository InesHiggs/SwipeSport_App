import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Swiper from "react-native-deck-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";

// Type guard for user data
function isUser(data) {
  return (
    typeof data === "object" &&
    data !== null &&
    "uid" in data &&
    "name" in data &&
    "proficiencyLevel" in data &&
    "availability" in data &&
    "age" in data
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Helper function to calculate common days
  const daysInCommon = (days1, days2) => {
    const set1 = new Set(days1);
    return days2.filter((day) => set1.has(day)).length;
  };

  // Fetch user data and potential matches
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;

        if (user) {
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
          const userData = userDoc.data();

          if (userDoc.exists() && isUser(userData)) {
            setCurrentUser(userData);

            const usersCollection = collection(FIREBASE_DB, "users");
            const usersSnapshot = await getDocs(query(usersCollection));

            const potentialMatches = usersSnapshot.docs
              .map((doc) => {
                const data = doc.data();
                if (!isUser(data)) return null;
                return { ...data, id: doc.id };
              })
              .filter((match) => {
                if (!match) return false;
                return (
                  match.uid !== user.uid &&
                  userData.levelPreference.includes(match.proficiencyLevel)
                );
              })
              .sort((a, b) => {
                return (
                  daysInCommon(userData.availability, b.availability) -
                  daysInCommon(userData.availability, a.availability)
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location" size={24} color={Colors.light.primary} />
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
                <Text style={styles.noMatchesText}>No matches found</Text>
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
                        <Text style={styles.cardAge}>, {card.age}</Text>
                      </View>
                      <Text style={styles.cardPronouns}>{card.pronouns}</Text>
                      <View style={styles.infoRow}>
                        <View style={styles.infoPill}>
                          <Text style={styles.infoText}>
                            {card.proficiencyLevel}
                          </Text>
                        </View>
                        <View style={styles.infoPill}>
                          <Text style={styles.infoText}>
                            {Array.isArray(card.availability)
                              ? card.availability.join(", ")
                              : card.availability}
                          </Text>
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
    paddingBottom: 8, // Reduced from default
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  locationButton: {
    padding: 8,
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
    paddingHorizontal: 40, // Add horizontal padding
    paddingBottom: 40, // Increase bottom padding to avoid navbar overlap
    paddingTop: 40, // Add top padding to reduce gap
  },
  swiperContainerStyle: {
    backgroundColor: "transparent",
  },
  cardStyle: {
    top: 0,
    width: "100%", // Take full width of container (minus padding)
    height: "100%", // Take full height of container
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
    height: Dimensions.get("window").height - 220, // Reduced height by 20
    marginTop: -20, // Add negative margin to move card up
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
    height: "40%",
    padding: 20,
    justifyContent: "flex-end",
  },
  cardDetails: {
    gap: 4,
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
  cardPronouns: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
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
  },
  noMatchesText: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: "center",
  },
});
