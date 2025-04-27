import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleProp,
  View,
  Pressable,
} from 'react-native';
import { AppStyles } from '@/constants/AppStyles';

type ButtonVariant = 'filled' | 'outlined' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface MaterialButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  color?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  onPress: () => void;
}

/**
 * MaterialButton - A Material You-inspired button component
 */
const MaterialButton: React.FC<MaterialButtonProps> = ({
  title,
  variant = 'filled',
  size = 'medium',
  leftIcon,
  rightIcon,
  fullWidth = false,
  loading = false,
  color,
  textColor,
  style,
  textStyle,
  disabled = false,
  onPress,
  ...rest
}) => {
  // Determine background color
  const backgroundColor = disabled
    ? AppStyles.Colors.buttonDisabled
    : color || (variant === 'filled' ? AppStyles.Colors.primary : 'transparent');

  // Determine text color
  const buttonTextColor = disabled
    ? AppStyles.Colors.onSurfaceVariant
    : textColor || 
      (variant === 'filled' 
        ? AppStyles.Colors.onPrimary 
        : AppStyles.Colors.primary);

  // Determine border
  const borderWidth = variant === 'outlined' ? 1 : 0;
  const borderColor = disabled
    ? AppStyles.Colors.buttonDisabled
    : variant === 'outlined'
    ? color || AppStyles.Colors.primary
    : 'transparent';

  // Determine padding based on size
  let paddingVertical;
  let paddingHorizontal;
  let fontSize;

  switch (size) {
    case 'small':
      paddingVertical = AppStyles.Spacing.xs;
      paddingHorizontal = AppStyles.Spacing.m;
      fontSize = AppStyles.Typography.bodyText.labelMedium.fontSize;
      break;
    case 'large':
      paddingVertical = AppStyles.Spacing.m;
      paddingHorizontal = AppStyles.Spacing.xl;
      fontSize = AppStyles.Typography.bodyText.titleMedium.fontSize;
      break;
    case 'medium':
    default:
      paddingVertical = AppStyles.Spacing.s;
      paddingHorizontal = AppStyles.Spacing.l;
      fontSize = AppStyles.Typography.bodyText.labelLarge.fontSize;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? darkenColor(backgroundColor as string, 0.1) : backgroundColor,
          borderWidth,
          borderColor,
          paddingVertical,
          paddingHorizontal,
          opacity: pressed ? 0.9 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      {...rest}
    >
      {({ pressed }) => (
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator 
              size="small" 
              color={buttonTextColor as string} 
              style={styles.spinner} 
            />
          ) : (
            <>
              {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
              <Text
                style={[
                  styles.text,
                  {
                    color: buttonTextColor,
                    fontSize,
                    opacity: pressed ? 0.8 : 1,
                  },
                  textStyle,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </Text>
              {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </>
          )}
        </View>
      )}
    </Pressable>
  );
};

// Helper function to darken a color (for press effect)
const darkenColor = (color: string, amount: number): string => {
  if (color === 'transparent') return color;
  
  // Simple darken for non-transparent colors
  return color === 'transparent' ? color : color + Math.floor(amount * 255).toString(16).padStart(2, '0');
};

const styles = StyleSheet.create({
  button: {
    borderRadius: AppStyles.BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...AppStyles.Shadows.small,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  spinner: {
    marginHorizontal: AppStyles.Spacing.xs,
  },
  iconLeft: {
    marginRight: AppStyles.Spacing.xs,
  },
  iconRight: {
    marginLeft: AppStyles.Spacing.xs,
  },
});

export default MaterialButton;
