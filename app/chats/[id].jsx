import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { useRouter } from 'expo-router';
import MessageBubble from '@/app/components/MessageBubble';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, addDoc, doc, getDoc, setDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/FirebaseConfig';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { AppStyles } from '@/constants/AppStyles';

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
        <ThemedView useMaterialBackground style={styles.container}>
          {/* Background image */}
          <Image 
            source={require('@/assets/images/bg.png')} 
            style={styles.backgroundImage} 
            resizeMode="cover"
          />
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={AppStyles.Colors.primary} />
            </TouchableOpacity>
            <ThemedText useMaterialStyle type="titleMedium" style={styles.headerTitle}>
              {otherUserName}
            </ThemedText>
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
              <Ionicons name="send" size={24} color={AppStyles.Colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: AppStyles.Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: AppStyles.Colors.divider,
    ...AppStyles.Shadows.small,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  messagesList: {
    padding: AppStyles.Spacing.m,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: AppStyles.Spacing.s,
    borderTopWidth: 1,
    borderTopColor: AppStyles.Colors.divider,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: AppStyles.Typography.bodyText.bodyLarge.fontSize,
    paddingVertical: AppStyles.Spacing.xs,
    paddingHorizontal: AppStyles.Spacing.m,
    backgroundColor: AppStyles.Colors.surfaceVariant,
    borderRadius: AppStyles.BorderRadius.full,
    marginRight: AppStyles.Spacing.s,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: AppStyles.Colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...AppStyles.Shadows.small,
  },
});

export default ChatPage;
