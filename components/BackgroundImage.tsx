import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Platform } from 'react-native';

// Import directly with require to avoid bundler issues
const bgImage = require('../assets/images/bg.png');

interface BackgroundImageProps {
  style?: any;
}

/**
 * A cross-platform background image component that ensures images load correctly
 * on iOS, Android and Web
 */
const BackgroundImage: React.FC<BackgroundImageProps> = ({ style }) => {
  // Use state to force re-render if needed
  const [imageKey, setImageKey] = useState(0);
  
  // Force reload image if issues occur
  useEffect(() => {
    // This can be used to force a re-render of the image component
    const forceReload = () => {
      setImageKey((prev) => prev + 1);
    };
    
    return () => {
      // Clean up any listeners if needed
    };
  }, []);

  return (
    <Image 
      key={`bg-image-${imageKey}`}
      source={bgImage}
      style={[styles.backgroundImage, style]} 
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});

export default BackgroundImage;
