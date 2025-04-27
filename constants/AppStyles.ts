/**
 * This file defines the design system for the SwipeSport app,
 * following Material You design principles.
 */

// Material You-inspired color palette
export const Colors = {
  // Primary colors
  primary: '#4CAF50', // Vibrant green as our accent color
  primaryLight: '#80E27E',
  primaryDark: '#087F23',
  
  // Surface colors
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  
  // Text colors
  onSurface: '#000000',
  onSurfaceVariant: '#555555',
  onPrimary: '#FFFFFF',
  
  // State colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Specific UI element colors
  navigationBar: '#FFFFFF',
  cardBackground: '#FFFFFF',
  buttonDisabled: '#CCCCCC',
  inputBorder: '#E0E0E0',
  inputFocusBorder: '#4CAF50',
  divider: '#E0E0E0',
  
  // Status colors
  liked: '#4CAF50',
  disliked: '#F44336',
  
  // Old color references (for backward compatibility during transition)
  legacyPurple: '#863f9c',
  legacyHighlight: '#ff6b6b',
};

// Spacing scale (in pixels)
export const Spacing = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius scale (in pixels)
export const BorderRadius = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

// Typography
export const Typography = {
  // App title font (Playfair Display or fallback)
  appTitle: {
    fontFamily: 'PlayfairDisplay-Bold', // Replace with actual font name if available
    fallbackFontFamily: 'serif',
    large: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: 'bold',
    },
    medium: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: 'bold',
    },
  },
  
  // General text font (Inter or system font)
  bodyText: {
    fontFamily: 'Inter', // Replace with actual font name if available
    fallbackFontFamily: 'System',
    
    // Display
    displayLarge: {
      fontSize: 57,
      lineHeight: 64,
      fontWeight: '700',
    },
    displayMedium: {
      fontSize: 45,
      lineHeight: 52,
      fontWeight: '700',
    },
    displaySmall: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700',
    },
    
    // Headline
    headlineLarge: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
    },
    headlineMedium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700',
    },
    headlineSmall: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700',
    },
    
    // Title
    titleLarge: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '600',
    },
    titleMedium: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
    },
    titleSmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
    },
    
    // Body
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodyMedium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
    
    // Label
    labelLarge: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    labelMedium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
    },
    labelSmall: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '500',
    },
  },
};

// Shadows for elevation
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.0,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 5.5,
    elevation: 8,
  },
};

// Common style presets
export const StylePresets = {
  // Card styles
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    ...Shadows.medium,
  },
  
  // Container styles
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.m,
  },
  
  // Flex presets
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// Animation constants
export const Animation = {
  timing: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
};

// Export everything as a design system object
export const AppStyles = {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
  StylePresets,
  Animation,
};

export default AppStyles;
