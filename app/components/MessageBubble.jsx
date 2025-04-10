import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ message, currentUserId }) => {
  if (!currentUserId) {
    console.warn("MessageBubble: currentUserId is undefined");
    return null;
  }
  const isMe = message.senderId === currentUserId;

  return (
    <View style={[styles.container, isMe ? styles.myMessage : styles.theirMessage]}>
      <Text style={[styles.text, isMe ? styles.myText : styles.theirText]}>
        {message.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: '75%', // Limit width for better chat appearance
  },
  myMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end', // Align user's messages to the right
  },
  theirMessage: {
    backgroundColor: '#e5e5ea',
    alignSelf: 'flex-start', // Align other person's messages to the left
  },
  text: {
    fontSize: 16,
  },
  myText: {
    color: '#fff', // White text for my messages
  },
  theirText: {
    color: '#000', // Black text for their messages
  },
});

export default MessageBubble;
