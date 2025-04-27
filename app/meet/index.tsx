import React, { useState, useEffect, useRef } from 'react';
import type { ComponentProps } from 'react';
import { 
  View, 
  Text, 
  Image as RNImage, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  PanResponder,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ScaledSize,
  StyleProp,
  Platform
} from 'react-native';
import type { 
  ViewProps,
  TextProps,
  ImageProps,
  LayoutChangeEvent,
  PanResponderGestureState
} from 'react-native';
import type { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, query, getDocs, doc, getDoc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import type { User } from '@/models/user';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { AppStyles } from '@/constants/AppStyles';

// Type guard for User data from Firestore
function isUser(data: DocumentData | undefined): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'uid' in data &&
    'name' in data &&
    'level' in data &&
    'availability' in data &&
    'age' in data
  );
}

// Default profile image
const DEFAULT_PROFILE_IMAGE = require('@/assets/images/bgd.png');

// Get initial dimensions
const window = Dimensions.get('window');
const initialDimensions: ScaledSize = {
  width: window.width,
  height: window.height,
  scale: window.scale,
  fontScale: window.fontScale
};

type Styles = {
  container: ViewStyle;
  backgroundImage: ImageStyle;
  loadingContainer: ViewStyle;
  noMatchesContainer: ViewStyle;
  noMoreMatchesContainer: ViewStyle;
  card: ViewStyle;
  cardImage: ImageStyle;
  cardGradient: ViewStyle;
  cardInfo: ViewStyle;
  cardName: TextStyle;
  cardDetails: TextStyle;
  likeBadge: ViewStyle;
  dislikeBadge: ViewStyle;
  badgeText: TextStyle;
};

const createStyles = (dimensions: ScaledSize): Styles => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppStyles.Colors.surface,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    zIndex: -1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: AppStyles.Spacing.l,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppStyles.Spacing.l,
  },
  noMoreMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppStyles.Spacing.l,
  },
  card: {
    width: dimensions.width * 0.9,
    height: dimensions.height * 0.7,
    borderRadius: AppStyles.BorderRadius.l,
    position: 'absolute',
    backgroundColor: AppStyles.Colors.surface,
    ...AppStyles.Shadows.large,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    justifyContent: 'flex-end',
    padding: AppStyles.Spacing.m,
  },
  cardInfo: {
    alignItems: 'flex-start',
  },
  cardName: {
    fontSize: AppStyles.Typography.bodyText.headlineMedium.fontSize,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: AppStyles.Spacing.xs,
  },
  cardDetails: {
    fontSize: AppStyles.Typography.bodyText.bodyLarge.fontSize,
    color: 'white',
    marginBottom: AppStyles.Spacing.xxs,
  },
  likeBadge: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 10,
    transform: [{ rotate: '30deg' }],
  },
  dislikeBadge: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 10,
    transform: [{ rotate: '-30deg' }],
  },
  badgeText: {
    borderWidth: 3,
    borderColor: AppStyles.Colors.liked,
    color: AppStyles.Colors.liked,
    fontSize: AppStyles.Typography.bodyText.displaySmall.fontSize,
    fontWeight: 'bold',
    padding: AppStyles.Spacing.s,
  },
});

export default function MeetScreen() {
  const [dimensions, setDimensions] = useState<ScaledSize>(initialDimensions);
  const [profiles, setProfiles] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const styles = React.useMemo(() => createStyles(dimensions), [dimensions]);

  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-dimensions.width / 2, 0, dimensions.width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rotateAndTranslate: Animated.WithAnimatedValue<ViewStyle> = {
    transform: [
      { rotate },
      ...position.getTranslateTransform(),
    ],
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [-dimensions.width / 2, 0, dimensions.width / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-dimensions.width / 2, 0, dimensions.width / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-dimensions.width / 2, 0, dimensions.width / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-dimensions.width / 2, 0, dimensions.width / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp',
  });

  const currentIndexRef = useRef(currentIndex);
  const profilesRef = useRef(profiles);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    profilesRef.current = profiles;
  }, [profiles]);

  // Pan responder for swipe gestures
  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_: any, gesture: PanResponderGestureState) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_: any, gesture: PanResponderGestureState) => {
      if (gesture.dx > 120) {
        swipeCard('right');
      } else if (gesture.dx < -120) {
        swipeCard('left');
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: true,
        }).start();
      }
    },
  }), []);

  const daysInCommon = (days1: string[], days2: string[]): number => {
    const set1 = new Set(days1);
    return days2.filter(day => set1.has(day)).length;
  };

  const swipeCard = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? dimensions.width + 100 : -dimensions.width - 100;
    const swipedIndex = currentIndexRef.current;
    const swipedProfile = profilesRef.current[swipedIndex];

    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(prev => prev + 1);
      position.setValue({ x: 0, y: 0 });

      if (direction === 'right' && swipedProfile) {
        router.push({
          pathname: `/chats/${swipedProfile.uid}`,
          params: { type: 'new' }
        });
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        
        if (user) {
          const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
          const userData = userDoc.data();
          
          if (userDoc.exists() && isUser(userData)) {
            setCurrentUser(userData);
            
            const usersCollection = collection(FIRESTORE_DB, 'users');
            const usersSnapshot = await getDocs(query(usersCollection));
            
            const potentialMatches = usersSnapshot.docs
              .map((doc: QueryDocumentSnapshot<DocumentData>) => {
                const data = doc.data();
                if (!isUser(data)) return null;
                return { ...data, id: doc.id } as User;
              })
              .filter((match): match is User => {
                if (!match) return false;
                return match.uid !== user.uid && 
                  userData.levelPreference.includes(match.level);
              })
              .filter((match): match is User => {
                return match !== null;
              })
              .sort((a, b) => {
                return daysInCommon(userData.availability, a.availability) - 
                       daysInCommon(userData.availability, b.availability);
              });
            
            setProfiles(potentialMatches);
          }
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatAvailability = (days: string[]): string => {
    if (!days || days.length === 0) return "Not specified";
    if (days.length <= 3) return days.join(", ");
    return `${days.slice(0, 2).join(", ")} +${days.length - 2} more`;
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        {/* Background image */}
        <RNImage 
          source={require('@/assets/images/bg.png')} 
          style={styles.backgroundImage} 
          resizeMode="cover"
        />
        <ActivityIndicator size="large" color="#863f9c" />
        <ThemedText>Finding your matches...</ThemedText>
      </ThemedView>
    );
  }

  if (profiles.length === 0) {
    return (
      <ThemedView style={styles.noMatchesContainer}>
        {/* Background image */}
        <RNImage 
          source={require('@/assets/images/bg.png')} 
          style={styles.backgroundImage} 
          resizeMode="cover"
        />
        <ThemedText type="title">No Matches Found</ThemedText>
        <ThemedText>We couldn't find any sports partners matching your preferences.</ThemedText>
      </ThemedView>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <ThemedView style={styles.noMoreMatchesContainer}>
        {/* Background image */}
        <RNImage 
          source={require('@/assets/images/bg.png')} 
          style={styles.backgroundImage} 
          resizeMode="cover"
        />
        <ThemedText type="title">No More Matches</ThemedText>
        <ThemedText>You've seen all potential sports partners for now.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Background image */}
      <RNImage 
        source={require('@/assets/images/bg.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />
      
      {currentIndex < profiles.length - 1 && (
        <Animated.View
          style={[
            styles.card,
            {
              opacity: nextCardOpacity,
              transform: [{ scale: nextCardScale }],
              zIndex: -1,
            } as ViewStyle,
          ]}
        >
          <RNImage 
            source={profiles[currentIndex + 1].image ? 
              { uri: profiles[currentIndex + 1].image } : 
              DEFAULT_PROFILE_IMAGE} 
            style={styles.cardImage} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.cardGradient}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>
                {profiles[currentIndex + 1].name}, {profiles[currentIndex + 1].age}
              </Text>
              <Text style={styles.cardDetails}>
                Level: {profiles[currentIndex + 1].level}
              </Text>
              <Text style={styles.cardDetails}>
                Available: {formatAvailability(profiles[currentIndex + 1].availability)}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          rotateAndTranslate as any,
        ]}
      >
        <Animated.View style={[styles.likeBadge, { opacity: likeOpacity }]}>
          <Text style={styles.badgeText}>LIKE</Text>
        </Animated.View>

        <Animated.View style={[styles.dislikeBadge, { opacity: dislikeOpacity }]}>
          <Text style={styles.badgeText}>NOPE</Text>
        </Animated.View>

        <RNImage 
          source={profiles[currentIndex].image ? 
            { uri: profiles[currentIndex].image } : 
            DEFAULT_PROFILE_IMAGE} 
          style={styles.cardImage} 
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>
              {profiles[currentIndex].name}, {profiles[currentIndex].age}
            </Text>
            <Text style={styles.cardDetails}>
              Level: {profiles[currentIndex].level}
            </Text>
            <Text style={styles.cardDetails}>
              Available: {formatAvailability(profiles[currentIndex].availability)}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </ThemedView>
  );
}