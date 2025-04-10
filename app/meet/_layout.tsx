import { Stack } from 'expo-router';

export default function MeetLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Find Partners",
        headerStyle: {
          backgroundColor: '#863f9c',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    />
  );
}