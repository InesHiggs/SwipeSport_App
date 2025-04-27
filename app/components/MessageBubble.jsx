import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppStyles } from '@/constants/AppStyles';
import { ThemedText } from '@/components/ThemedText';

const MessageBubble = ({ message, currentUserId }) => {
  if (!currentUserId) {
    console.warn("MessageBubble: currentUserId is undefined");
    return null;
  }
  const isMe = message.senderId === currentUserId;

  return (
    <View style={[styles.container, isMe ? styles.myMessage : styles.theirMessage]}>
      <ThemedText 
        style={[styles.text, isMe ? styles.myText : styles.theirText]}
        useMaterialStyle 
        type="bodyMedium"
      >
        {message.text}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: AppStyles.Spacing.s,
    borderRadius: AppStyles.BorderRadius.l,
    marginVertical: AppStyles.Spacing.xs,
    maxWidth: '75%', // Limit width for better chat appearance
    ...AppStyles.Shadows.small,
  },
  myMessage: {
    backgroundColor: AppStyles.Colors.primary,
    alignSelf: 'flex-end', // Align user's messages to the right
  },
  theirMessage: {
    backgroundColor: AppStyles.Colors.surfaceVariant,
    alignSelf: 'flex-start', // Align other person's messages to the left
  },
  text: {
    fontSize: AppStyles.Typography.bodyText.bodyMedium.fontSize,
  },
  myText: {
    color: AppStyles.Colors.onPrimary, // White text for my messages
  },
  theirText: {
    color: AppStyles.Colors.onSurface, // Dark text for their messages
  },
});

export default MessageBubble;
