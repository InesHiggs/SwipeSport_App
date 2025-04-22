import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";
import Swiper from "react-native-deck-swiper";
import { LinearGradient } from "expo-linear-gradient";

// Dummy data for testing
const dummyUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    pronouns: "she/her",
    age: 24,
    proficiency: "Intermediate 2",
    availability: "Weekends",
    image: require("../assets/images/player1.jpg"),
  },

  {
    id: 2,
    name: "Sarah Johnson",
    pronouns: "she/her",
    age: 24,
    proficiency: "Intermediate 2",
    availability: "Weekends",
    image: require("../assets/images/player1.jpg"),
  },

  {
    id: 3,
    name: "Sarah Johnson",
    pronouns: "she/her",
    age: 24,
    proficiency: "Intermediate 2",
    availability: "Weekends",
    image: require("../assets/images/player1.jpg"),
  },

  {
    id: 4,
    name: "Sarah Johnson",
    pronouns: "she/her",
    age: 24,
    proficiency: "Intermediate 2",
    availability: "Weekends",
    image: require("../assets/images/player1.jpg"),
  },
  // Add more dummy users...
];

export default function HomeScreen() {
  const router = useRouter();
  const windowHeight = Dimensions.get("window").height;

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
        <Swiper
          cards={dummyUsers}
          renderCard={(card) => (
            <View style={styles.card}>
              <Image source={card.image} style={styles.cardImage} />
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
                      <Text style={styles.infoText}>{card.proficiency}</Text>
                    </View>
                    <View style={styles.infoPill}>
                      <Text style={styles.infoText}>{card.availability}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}
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
      </View>

      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navItem, styles.activeNavItem]}
          onPress={() => {}}
        >
          <Ionicons name="people" size={24} color={Colors.light.primary} />
          <Text style={styles.navText}>Meet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/likes")}
        >
          <Ionicons name="heart" size={24} color={Colors.light.text} />
          <Text style={styles.navText}>Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/messages")}
        >
          <Ionicons name="chatbubbles" size={24} color={Colors.light.text} />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person" size={24} color={Colors.light.text} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
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
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#fff",
  },
  navItem: {
    alignItems: "center",
    padding: 8,
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: Colors.light.primary,
    marginTop: -2,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: Colors.light.text,
  },
});
