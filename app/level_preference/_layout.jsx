import { Stack } from 'expo-router';

export default function LevelPreferenceLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Level Preferences",
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