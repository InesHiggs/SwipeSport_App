import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AppStyles } from '@/constants/AppStyles';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  useMaterialBackground?: boolean;
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  useMaterialBackground = false,
  ...otherProps 
}: ThemedViewProps) {
  // If using material background, use our new design system
  if (useMaterialBackground) {
    return <View style={[{ backgroundColor: AppStyles.Colors.surface }, style]} {...otherProps} />;
  }
  
  // Otherwise, fall back to the existing theme system
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
