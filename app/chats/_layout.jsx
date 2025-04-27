import { Stack } from 'expo-router';

const ChatLayout = () => {
  return (
    <Stack 
      screenOptions={{
        headerShown: false // Hide default header for all chat screens
      }}
    />
  );
};

export default ChatLayout;
