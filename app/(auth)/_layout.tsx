import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="signup-details" />
      <Stack.Screen name="signup-personal" />
      <Stack.Screen name="signup-preference" />
    </Stack>
  );
}
