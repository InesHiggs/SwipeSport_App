import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 20 : 6,
          height: Platform.OS === "ios" ? 80 : 60,
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarItemStyle: {
          padding: 4,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "500",
        },
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Meet",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="people"
              size={24}
              color={focused ? Colors.light.primary : Colors.light.text}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: "Likes",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="heart"
              size={24}
              color={focused ? Colors.light.primary : Colors.light.text}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubbles"
              size={24}
              color={focused ? Colors.light.primary : Colors.light.text}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person"
              size={24}
              color={focused ? Colors.light.primary : Colors.light.text}
            />
          ),
        }}
      />
    </Tabs>
  );
}
