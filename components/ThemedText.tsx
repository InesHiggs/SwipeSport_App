import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AppStyles } from '@/constants/AppStyles';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 
         'displayLarge' | 'displayMedium' | 'displaySmall' | 
         'headlineLarge' | 'headlineMedium' | 'headlineSmall' | 
         'titleLarge' | 'titleMedium' | 'titleSmall' |
         'bodyLarge' | 'bodyMedium' | 'bodySmall' |
         'labelLarge' | 'labelMedium' | 'labelSmall';
  useMaterialStyle?: boolean;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  useMaterialStyle = false,
  ...rest
}: ThemedTextProps) {
  // If using material style, use our new design system
  if (useMaterialStyle) {
    const getMaterialStyle = () => {
      switch (type) {
        case 'title':
          return AppStyles.Typography.bodyText.headlineLarge;
        case 'subtitle':
          return AppStyles.Typography.bodyText.titleLarge;
        case 'link':
          return { ...AppStyles.Typography.bodyText.bodyLarge, color: AppStyles.Colors.primary };
        case 'defaultSemiBold':
          return { ...AppStyles.Typography.bodyText.bodyLarge, fontWeight: '600' };
        case 'displayLarge':
        case 'displayMedium':
        case 'displaySmall':
        case 'headlineLarge':
        case 'headlineMedium':
        case 'headlineSmall':
        case 'titleLarge':
        case 'titleMedium':
        case 'titleSmall':
        case 'bodyLarge':
        case 'bodyMedium':
        case 'bodySmall':
        case 'labelLarge':
        case 'labelMedium':
        case 'labelSmall':
          return AppStyles.Typography.bodyText[type];
        default:
          return AppStyles.Typography.bodyText.bodyLarge;
      }
    };

    return (
      <Text
        style={[
          { color: AppStyles.Colors.onSurface },
          getMaterialStyle(),
          style,
        ]}
        {...rest}
      />
    );
  }
  
  // Otherwise, fall back to the existing theme system
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
