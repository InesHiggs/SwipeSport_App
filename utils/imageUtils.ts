import { Platform } from 'react-native';

/**
 * This utility function helps cache busting for static assets
 * that might not be loading correctly on different platforms.
 * 
 * It adds a timestamp parameter to the image URL to force a fresh load.
 * 
 * @param imagePath The path to the image asset
 * @returns The image path with cache busting parameters if needed
 */
export const getImageSource = (imagePath: any) => {
  // For web, use cache busting
  if (Platform.OS === 'web') {
    // If it's already a URL (not a require'd asset), add timestamp
    if (typeof imagePath === 'string') {
      return `${imagePath}?t=${Date.now()}`;
    }
  }
  
  // For imported/required images, just return as is
  return imagePath;
};

/**
 * Force reload and clear cache for image assets that might be problematic
 * This is useful for troubleshooting image loading issues
 */
export const clearImageCache = () => {
  // This is a no-op for native platforms
  if (Platform.OS === 'web') {
    // Clear browser cache for images (web only)
    if (typeof window !== 'undefined' && window.location) {
      // Force reload without cache
      window.location.reload();
    }
  }
};
