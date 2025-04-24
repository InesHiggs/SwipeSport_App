import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/Colors";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const getAccessibilityLabel = (route) => {
    const labels = {
      "/": "Meet tab, find sports partners",
      "/likes": "Likes tab, view people who liked you",
      "/messages": "Messages tab, view your conversations",
      "/profile": "Profile tab, manage your account",
    };
    return labels[route];
  };

  return (
    <View style={styles.navbar}>
      {[
        { path: "/", icon: "people", label: "Meet" },
        { path: "/likes", icon: "heart", label: "Likes" },
        { path: "/messages", icon: "chatbubbles", label: "Messages" },
        { path: "/profile", icon: "person", label: "Profile" },
      ].map((item) => (
        <TouchableOpacity
          key={item.path}
          style={[
            styles.navItem,
            pathname === item.path && styles.activeNavItem,
          ]}
          onPress={() => router.push(item.path)}
          accessible={true}
          accessibilityLabel={getAccessibilityLabel(item.path)}
          accessibilityRole="tab"
          accessibilityState={{ selected: pathname === item.path }}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={item.icon}
              size={28}
              color={
                pathname === item.path
                  ? Colors.light.primary
                  : Colors.light.text
              }
            />
          </View>
          <Text
            style={[
              styles.navText,
              pathname === item.path && styles.activeNavText,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 6,
    paddingBottom: Platform.OS === "ios" ? 20 : 6,
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
  navItem: {
    alignItems: "center",
    minHeight: 44,
    minWidth: 80,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  iconContainer: {
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
  },
  activeNavItem: {
    borderTopWidth: 3,
    borderTopColor: Colors.light.primary,
    marginTop: -3,
  },
  navText: {
    fontSize: 14,
    marginTop: 4,
    color: Colors.light.text,
    fontWeight: "500",
  },
  activeNavText: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
});
