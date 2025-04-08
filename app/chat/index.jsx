import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ChatItem from '@/app/components/ChatItem';

// Hardcoded list of chats
const chats = [
  { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you?', time: '10:30 AM' },
  { id: 2, name: 'Jane Smith', lastMessage: 'See you later!', time: '9:15 AM' },
  { id: '06Fr4v5wpbTcGuUVyvm7np0d8Yg1', name: 'Alice Johnson', lastMessage: 'Let’s meet tomorrow.', time: 'Yesterday' },
];

const ChatsListPage = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ChatItem chat={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ChatsListPage;