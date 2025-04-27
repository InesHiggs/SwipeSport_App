import { Stack } from 'expo-router';
import { View, StyleSheet, Dimensions } from 'react-native';
import SvgLogo from '../../components/SvgLogo';

const screenWidth = Dimensions.get('window').width;

export default function MeetLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            <SvgLogo width={screenWidth * 0.4} height={40} />
          </View>
        ),
        headerLeft: () => null,
        headerStyle: {
          backgroundColor: 'transparent',
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});