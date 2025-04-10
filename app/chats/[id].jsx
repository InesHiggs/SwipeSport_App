import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import MessageBubble from '@/app/components/MessageBubble';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, addDoc, doc, getDoc, setDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/FirebaseConfig';
import { useLocalSearchParams } from 'expo-router';

const ChatPage = () => {
  const router = useRouter();
  const { id, type } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(null);
  const [otherUserName, setOtherUserName] = useState('');
  const currentUser = getAuth().currentUser;

  useEffect(() => {
    if (!currentUser || !id) return;
    checkOrCreateChat();
  }, [currentUser, id]);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(FIRESTORE_DB, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const fetchOtherUserName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setOtherUserName(userData.name || 'User');
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const checkOrCreateChat = async () => {
    try {
      if (type === 'existing') {
        setChatId(id);
        const chatDoc = await getDoc(doc(FIRESTORE_DB, 'chats', id));
        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          const otherUserId = chatData.participants.find(pid => pid !== currentUser.uid);
          if (otherUserId) {
            await fetchOtherUserName(otherUserId);
          }
        }
        return;
      }

      const chatsRef = collection(FIRESTORE_DB, 'chats');
      const chatsSnapshot = await getDocs(chatsRef);
      
      for (const chatDoc of chatsSnapshot.docs) {
        const usersRef = collection(FIRESTORE_DB, 'chats', chatDoc.id, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const userIds = usersSnapshot.docs.map(doc => doc.id);

        if (userIds.includes(currentUser.uid) && userIds.includes(id) && userIds.length === 2) {
          setChatId(chatDoc.id);
          await fetchOtherUserName(id);
          return;
        }
      }

      const newChatRef = await addDoc(chatsRef, {
        createdAt: serverTimestamp(),
        participants: [currentUser.uid, id],
      });

      await setDoc(doc(FIRESTORE_DB, 'chats', newChatRef.id, 'users', currentUser.uid), { exists: true });
      await setDoc(doc(FIRESTORE_DB, 'chats', newChatRef.id, 'users', id), { exists: true });

      setChatId(newChatRef.id);
      await fetchOtherUserName(id);
    } catch (error) {
      console.error('Error in chat setup:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatId || !currentUser) return;

    const messagesRef = collection(FIRESTORE_DB, 'chats', chatId, 'messages');

    await addDoc(messagesRef, {
      text: input.trim(),
      senderId: currentUser.uid,
      timestamp: serverTimestamp()
    });

    setInput('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={130}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{otherUserName}</Text>
            <View style={styles.headerRight} />
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              currentUser ? <MessageBubble message={item} currentUserId={currentUser.uid} /> : null
            )}
            contentContainerStyle={styles.messagesList}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 60,
  },
  backText: {
    fontSize: 16,
    color: '#007bff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 60,
  },
  messagesList: {
    padding: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ChatPage;
