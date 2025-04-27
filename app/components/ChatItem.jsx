import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AppStyles } from '@/constants/AppStyles';
import { ThemedText } from '@/components/ThemedText';

const ChatItem = ({ chat }) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() =>
        router.push({
          pathname: `/chats/${chat.id}`,
          params: {
            id: chat.id,
            type: 'existing', 
          },
        })
      }
    >
      <Image source={{ uri: chat.image }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <ThemedText useMaterialStyle type="titleMedium" style={styles.name}>
          {chat.name}
        </ThemedText>
        <ThemedText useMaterialStyle type="bodyMedium" style={styles.lastMessage} numberOfLines={1}>
          {chat.lastMessage}
        </ThemedText>
      </View>
      <ThemedText useMaterialStyle type="labelSmall" style={styles.time}>
        {chat.time}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppStyles.Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: AppStyles.Colors.divider,
    backgroundColor: AppStyles.Colors.surface,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: AppStyles.Spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    marginBottom: AppStyles.Spacing.xxs,
  },
  lastMessage: {
    color: AppStyles.Colors.onSurfaceVariant,
  },
  time: {
    color: AppStyles.Colors.onSurfaceVariant,
  },
});

export default ChatItem;
