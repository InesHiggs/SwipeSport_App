import { Stack } from 'expo-router';

const ChatLayout = () => {
  return (
    <Stack 
      screenOptions={({ route }) => {
        const { id } = route.params || {};
        const chatNames = {
          1: 'John Doe',
          2: 'Jane Smith',
          3: 'Alice Johnson',
        };

        const personName = chatNames[id];

        return {
          headerShown: !!personName, // Hide header if personName is undefined
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitle: personName || '',
        };
      }}
    />
  );
};

export default ChatLayout;
