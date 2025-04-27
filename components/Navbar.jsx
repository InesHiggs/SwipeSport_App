import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';
import { AppStyles } from '@/constants/AppStyles';

export default function Navbar({ title }) {
  const router = useRouter();
  const pathname = usePathname();
  const backgroundColor = AppStyles.Colors.navigationBar;
  const textColor = AppStyles.Colors.onSurfaceVariant;
  const activeColor = AppStyles.Colors.primary;
  
  const isActive = (path) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Find', path: '/meet', icon: 'search' },
    { name: 'Chats', path: '/chats', icon: 'chatbubbles' },
    { name: 'People', path: '/accepted_people', icon: 'people' },
    { name: 'Profile', path: '/profile', icon: 'person' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.navContainer}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.path}
            style={[
              styles.navItem,
              isActive(item.path) && styles.activeNavItem
            ]}
            onPress={() => router.push(item.path)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={isActive(item.path) ? activeColor : textColor}
            />
            <Text
              style={[
                styles.navText,
                { color: isActive(item.path) ? activeColor : textColor }
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: AppStyles.Spacing.s,
    paddingBottom: Platform.OS === 'ios' ? AppStyles.Spacing.l : AppStyles.Spacing.s,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: AppStyles.Spacing.m,
    paddingVertical: AppStyles.Spacing.xs,
  },
  activeNavItem: {
    borderTopWidth: 3,
    borderTopColor: AppStyles.Colors.primary,
  },
  navText: {
    fontSize: AppStyles.Typography.bodyText.labelSmall.fontSize,
    marginTop: AppStyles.Spacing.xxs,
    fontWeight: '500',
  },
});
