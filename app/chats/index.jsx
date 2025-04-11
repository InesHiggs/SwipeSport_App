import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import ChatItem from '../components/ChatItem';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ChatsPage = () => {
  const [chats, setChats] = useState([]);
  const router = useRouter();
  //const currentUser = FIREBASE_AUTH.currentUser;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        console.log("Logged in as:", user.uid);
        setCurrentUser(user);
        fetchChats(user);
        //fetchChats(user); // pass user directly
      } else {
        console.log("No user logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
    //fetchChats();
  }, []);

  const fetchChats = async (user) => {
    if (!user) return;
  
    try {
      const chatsRef = collection(FIRESTORE_DB, 'chats');
      const chatsSnapshot = await getDocs(query(chatsRef));
      
      const chatPromises = chatsSnapshot.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data();
        
        if (!chatData.participants?.includes(user.uid)) return null;
  
        const otherUserId = chatData.participants.find(id => id !== user.uid);
        const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', otherUserId));
        const userData = userDoc.data();
  
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
