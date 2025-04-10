import { Stack } from 'expo-router';

export default function MeetLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown:false,
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