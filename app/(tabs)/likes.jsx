import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/FirebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";

export default function LikesScreen() {
  const router = useRouter();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) return;

        const likesQuery = query(
          collection(FIREBASE_DB, "likes"),
          where("likedUserId", "==", user.uid)
        );

        const likesSnapshot = await getDocs(likesQuery);
        const likesData = [];

        for (const doc of likesSnapshot.docs) {
          const likeData = doc.data();
          // Fetch user data for each like
          const userDoc = await getDocs(
            doc(FIREBASE_DB, "users", likeData.userId)
          );
          if (userDoc.exists()) {
            likesData.push({
              id: doc.id,
              ...likeData,
              user: userDoc.data(),
            });
          }
        }

        setLikes(likesData);
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  const renderLikeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.likeCard}
      onPress={() => router.push(`/chats/${item.userId}`)}
    >
      <Image
        source={
          item.user.photo
            ? { uri: item.user.photo }
            : require("../../assets/images/player1.jpg")
        }
        style={styles.userImage}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.user.name}</Text>
        <Text style={styles.userDetails}>
          {item.user.age} • {item.user.proficiencyLevel}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.light.text} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Likes</Text>
      </View>

      <View style={styles.content}>
        {(() => {
          if (loading) {
            return (
              <ActivityIndicator size="large" color={Colors.light.primary} />
            );
          } else if (likes.length === 0) {
            return (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No likes yet</Text>
              </View>
            );
          } else {
            return (
              <FlatList
                data={likes}
                renderItem={renderLikeItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.likesList}
              />
            );
          }
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "PlayfairDisplay-Medium",
    color: Colors.light.primary,
  },
  likesList: {
    padding: 16,
  },
  likeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  userDetails: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  content: {
    flex: 1,
  },
});
