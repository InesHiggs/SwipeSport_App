import React, { useState, useEffect } from "react";
import {
  Image,
  ActivityIndicator,
  View,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Colors } from "../constants/Colors";

interface NetworkImageComponentProps {
  userId: string | null;
  style?: object;
  defaultImage: ImageSourcePropType;
}

/**
 * Component that fetches and displays images from Firebase Storage with proper caching control
 * Re-fetches image URL on each render to ensure fresh authentication tokens
 */
const NetworkImageComponent: React.FC<NetworkImageComponentProps> = ({
  userId,
  style,
  defaultImage,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchFreshImageUrl = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const storage = getStorage();
        const imageRef = ref(storage, `profile_images/${userId}`);
        const url = await getDownloadURL(imageRef);
        console.log("Fresh Firebase Storage URL fetched:", url);
        setImageUrl(url);
        setError(false);
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFreshImageUrl();

    // Re-fetch URL when userId changes
  }, [userId]);

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (error || !imageUrl) {
    return <Image source={defaultImage} style={style} resizeMode="cover" />;
  }

  return (
    <Image
      source={{
        uri: imageUrl,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }}
      style={style}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NetworkImageComponent;
