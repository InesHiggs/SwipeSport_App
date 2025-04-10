import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import ChatItem from '../components/ChatItem';

const ChatsPage = () => {
  const [chats, setChats] = useState([]);
  const router = useRouter();
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    if (!currentUser) return;

    try {
      const chatsRef = collection(FIRESTORE_DB, 'chats');
      const chatsSnapshot = await getDocs(query(chatsRef));
      
      const chatPromises = chatsSnapshot.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data();
        
        // Only include chats where the current user is a participant
        if (!chatData.participants?.includes(currentUser.uid)) {
          return null;
        }

        // Get the other participant's ID
        const otherUserId = chatData.participants.find(id => id !== currentUser.uid);
        
        // Get the other user's details
        const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', otherUserId));
        const userData = userDoc.data();

        // Get the last message
        const messagesRef = collection(FIRESTORE_DB, 'chats', chatDoc.id, 'messages');
        const messagesSnapshot = await getDocs(query(messagesRef));
        const messages = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const lastMessage = messages.length > 0 
          ? messages[messages.length - 1].text 
          : 'No messages yet';

        return {
          id: chatDoc.id,
          name: userData?.name || 'Unknown User',
          image: userData?.image || null,
          lastMessage,
          timestamp: chatData.createdAt,
        };
      });

      const validChats = (await Promise.all(chatPromises)).filter(chat => chat !== null);
      setChats(validChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem chat={item} />
        )}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
});

export default ChatsPage;
