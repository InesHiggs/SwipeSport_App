import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  StyleProp,
  TouchableOpacity,
  KeyboardTypeOptions,
} from 'react-native';
import { AppStyles } from '@/constants/AppStyles';

interface MaterialTextInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingAction?: () => void;
  fullWidth?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  helperTextStyle?: StyleProp<TextStyle>;
  keyboardType?: KeyboardTypeOptions;
  secure?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

/**
 * MaterialTextInput - A Material You-inspired text input component
 */
const MaterialTextInput: React.FC<MaterialTextInputProps> = ({
  label,
  helperText,
  error = false,
  errorText,
  leadingIcon,
  trailingIcon,
  trailingAction,
  fullWidth = false,
  containerStyle,
  inputStyle,
  labelStyle,
  helperTextStyle,
  keyboardType,
  secure = false,
  multiline = false,
  numberOfLines = 1,
  value,
  onChangeText,
  placeholder,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(secure);

  // Determine border color based on state
  const getBorderColor = () => {
    if (error) return AppStyles.Colors.error;
    if (isFocused) return AppStyles.Colors.inputFocusBorder;
    return AppStyles.Colors.inputBorder;
  };

  // Toggle password visibility
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={[
      styles.container,
      { width: fullWidth ? '100%' : undefined },
      containerStyle
    ]}>
      {label && (
        <Text 
          style={[
            styles.label,
            { color: error ? AppStyles.Colors.error : AppStyles.Colors.onSurfaceVariant },
            labelStyle
          ]}
        >
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        { 
          borderColor: getBorderColor(),
          borderWidth: 1,
          backgroundColor: isFocused ? AppStyles.Colors.surface : AppStyles.Colors.surfaceVariant,
          height: multiline ? undefined : 56,
        }
      ]}>
        {leadingIcon && <View style={styles.leadingIcon}>{leadingIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            { 
              textAlignVertical: multiline ? 'top' : 'center',
              height: multiline ? undefined : '100%',
            },
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={AppStyles.Colors.onSurfaceVariant}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        
        {(trailingIcon || secure) && (
          <TouchableOpacity 
            onPress={secure ? toggleSecureEntry : trailingAction}
            style={styles.trailingIcon}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            {trailingIcon}
            {secure && (
              <Text style={styles.toggleText}>
                {secureTextEntry ? 'Show' : 'Hide'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {(helperText || (error && errorText)) && (
        <Text 
          style={[
            styles.helperText,
            { color: error ? AppStyles.Colors.error : AppStyles.Colors.onSurfaceVariant },
            helperTextStyle
          ]}
        >
          {error ? errorText : helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: AppStyles.Spacing.s,
  },
  label: {
    marginBottom: AppStyles.Spacing.xs,
    fontSize: AppStyles.Typography.bodyText.labelMedium.fontSize,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: AppStyles.BorderRadius.s,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: AppStyles.Spacing.m,
    fontSize: AppStyles.Typography.bodyText.bodyLarge.fontSize,
    color: AppStyles.Colors.onSurface,
  },
  leadingIcon: {
    paddingLeft: AppStyles.Spacing.m,
  },
  trailingIcon: {
    paddingRight: AppStyles.Spacing.m,
  },
  helperText: {
    marginTop: AppStyles.Spacing.xxs,
    fontSize: AppStyles.Typography.bodyText.bodySmall.fontSize,
  },
  toggleText: {
    fontSize: AppStyles.Typography.bodyText.labelSmall.fontSize,
    color: AppStyles.Colors.primary,
  },
});

export default MaterialTextInput;
