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
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";

export default function MessagesScreen() {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) return;

        const chatsQuery = query(
          collection(FIREBASE_DB, "chats"),
          where("participants", "array-contains", user.uid),
          orderBy("lastMessageTime", "desc")
        );

        const chatsSnapshot = await getDocs(chatsQuery);
        const chatsData = [];

        for (const doc of chatsSnapshot.docs) {
          const chatData = doc.data();
          // Get the other user's ID
          const otherUserId = chatData.participants.find(
            (id) => id !== user.uid
          );
          // Fetch other user's data
          const userDoc = await getDocs(doc(FIREBASE_DB, "users", otherUserId));

          if (userDoc.exists()) {
            chatsData.push({
              id: doc.id,
              ...chatData,
              otherUser: userDoc.data(),
            });
          }
        }

        setChats(chatsData);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatCard}
      onPress={() => router.push(`/chats/${item.otherUser.uid}`)}
    >
      <Image
        source={
          item.otherUser.photo
            ? { uri: item.otherUser.photo }
            : require("../../assets/images/default-avatar.png")
        }
        style={styles.userImage}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>{item.otherUser.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage || "No messages yet"}
        </Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.light.primary} />
        ) : chats.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
          </View>
        ) : (
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatsList}
          />
        )}
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
  chatsList: {
    padding: 16,
  },
  chatCard: {
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
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  unreadBadge: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
