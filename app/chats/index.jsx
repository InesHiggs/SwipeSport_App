import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const ChatsListPage = () => {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wait for Firebase auth to finish
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log("⚠️ No user logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch chats where user is a participant
  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = collection(FIRESTORE_DB, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("✅ Chats fetched:", chatsData);
      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);
  
  const openChat = (chatid) => {
    //router.push(`/chats/${chatid}`);
    router.push({
      pathname: `/chats/${chatid}`,
      params: { type: 'existing' }
    });
  };
  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openChat(item.id)}>
            <View style={styles.chatItem}>
              <Text style={styles.chatText}>Chat ID: {item.id}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No chats available</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    elevation: 1,
  },
  chatText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default ChatsListPage;
