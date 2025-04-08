import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { useRouter } from 'expo-router';
import MessageBubble from '@/app/components/MessageBubble';
import { getAuth } from 'firebase/auth';
import {collection,getDocs,addDoc,doc,setDoc,query,orderBy,onSnapshot,serverTimestamp}from 'firebase/firestore';
import { FIRESTORE_DB } from '@/FirebaseConfig';
import { useLocalSearchParams } from 'expo-router';




const ChatPage = () => {
  const router = useRouter();
  //const id = '06Fr4v5wpbTcGuUVyvm7np0d8Yg1'; // Hardcoded for now -> fuck bogdan
  const { id } = useLocalSearchParams();
  console.log("uid chat: ", id);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(null);
  const currentUser = getAuth().currentUser;
  


  // Check or create chat
  useEffect(() => {
    if (!currentUser || !id) return;
    checkOrCreateChat();
  }, [currentUser, id]);

  // Listen to real-time messages when chatId is known
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

  const checkOrCreateChat = async () => {
    try {
      const chatsRef = collection(FIRESTORE_DB, 'chats');
      const chatsSnapshot = await getDocs(chatsRef);

      for (const chatDoc of chatsSnapshot.docs) {
        const usersRef = collection(FIRESTORE_DB, 'chats', chatDoc.id, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const userIds = usersSnapshot.docs.map(doc => doc.id);

        if (
          userIds.includes(currentUser.uid) &&
          userIds.includes(id) &&
          userIds.length === 2
        ) {
          console.log('Chat already exists:', chatDoc.id);
          setChatId(chatDoc.id);
          return;
        }
      }

      const newChatRef = await addDoc(chatsRef, {
        createdAt: serverTimestamp()
      });

      await setDoc(doc(FIRESTORE_DB, 'chats', newChatRef.id, 'users', currentUser.uid), { exists: true });
      await setDoc(doc(FIRESTORE_DB, 'chats', newChatRef.id, 'users', id), { exists: true });

      console.log('Chat created with ID:', newChatRef.id);
      setChatId(newChatRef.id);
    } catch (error) {
      console.error('Error creating chat:', error);
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
      keyboardVerticalOffset={130} // adjust based on header height
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={{ paddingBottom: 10 }}
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
    padding: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007bff',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatPage;
