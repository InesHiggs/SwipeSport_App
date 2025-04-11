import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const ChatItem = ({ chat }) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.container} onPress={() =>
      router.push({
        pathname: `/chats/${chat.id}`,
        params: {
          id: chat.id,
          type: 'existing', 
        },
      })
    }>
      <Image source={{ uri: chat.image }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{chat.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {chat.lastMessage}
        </Text>
      </View>
      <Text style={styles.time}>{chat.time}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});

export default ChatItem;
