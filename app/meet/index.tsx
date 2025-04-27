import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  PanResponder,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { AppStyles } from '@/constants/AppStyles';
import type { User } from '@/models/user';

// Default profile image
const DEFAULT_PROFILE_IMAGE = require('@/assets/images/bgd.png');

// Get initial dimensions
const window = Dimensions.get('window');

export default function MeetScreen() {
  const [dimensions, setDimensions] = useState({
    width: window.width,
    height: window.height
  });
  const [profiles, setProfiles] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-dimensions.width / 2, 0, dimensions.width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rotateAndTranslate = {
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

  // Resize handler
  useEffect(() => {
    const updateLayout = () => {
      const newWindow = Dimensions.get('window');
      setDimensions({
        width: newWindow.width,
        height: newWindow.height
      });
    };

    const subscription = Dimensions.addEventListener('change', updateLayout);
    return () => subscription.remove();
  }, []);

  // Pan responder for swipe gestures
  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
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
    const swipedIndex = currentIndex;
    const swipedProfile = profiles[swipedIndex];

    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(prev => prev + 1);
      position.setValue({ x: 0, y: 0 });

      if (direction === 'right' && swipedProfile) {
        // When a user is liked, open chat directly with that person
        router.push({
          pathname: "/chats/[id]",
          params: { id: swipedProfile.uid, type: 'new' }
        });
      }
    });
  };

  // Fetch user data and potential matches
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = FIREBASE_AUTH.currentUser;
        
        if (user) {
          const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
          const userData = userDoc.data() as User;
          
          if (userDoc.exists() && userData) {
            setCurrentUser(userData);
            
            const usersCollection = collection(FIRESTORE_DB, 'users');
            const usersSnapshot = await getDocs(query(usersCollection));
            
            const potentialMatches = usersSnapshot.docs
              .map(doc => {
                const data = doc.data() as User;
                return { ...data, id: doc.id };
              })
              .filter(match => {
                // If user has no level preferences, show all profiles
                // Otherwise filter by level preference
                return match.uid !== user.uid && 
                  (!userData.levelPreference || 
                   userData.levelPreference.length === 0 || 
                   userData.levelPreference.includes(match.level));
              })
              .sort((a, b) => {
                return daysInCommon(userData.availability || [], b.availability || []) - 
                       daysInCommon(userData.availability || [], a.availability || []);
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
        <Image 
          source={require('@/assets/images/bg.png')} 
          style={styles.backgroundImage} 
          resizeMode="cover"
        />
        <ActivityIndicator size="large" color={AppStyles.Colors.primary} />
        <ThemedText style={styles.loadingText}>Finding your matches...</ThemedText>
      </ThemedView>
    );
  }

  if (profiles.length === 0) {
    return (
      <ThemedView style={styles.noMatchesContainer}>
        {/* Background image */}
        <Image 
          source={require('@/assets/images/bg.png')} 
          style={styles.backgroundImage} 
          resizeMode="cover"
        />
        <View style={styles.messageCard}>
          <ThemedText style={styles.titleText}>No Matches Found</ThemedText>
          <ThemedText style={styles.descriptionText}>
            We couldn't find any sports partners matching your preferences.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <ThemedView style={styles.noMoreMatchesContainer}>
        {/* Background image */}
        <Image 
          source={require('@/assets/images/bg.png')} 
          style={styles.backgroundImage} 
          resizeMode="cover"
        />
        <View style={styles.messageCard}>
          <ThemedText style={styles.titleText}>No More Matches</ThemedText>
          <ThemedText style={styles.descriptionText}>
            You've seen all potential sports partners for now.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Background image */}
      <Image 
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
            },
          ]}
        >
          <Image 
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
                Available: {formatAvailability(profiles[currentIndex + 1].availability || [])}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          rotateAndTranslate,
        ]}
      >
        <Animated.View style={[styles.likeBadge, { opacity: likeOpacity }]}>
          <Text style={[styles.badgeText, styles.likeBadgeText]}>LIKE</Text>
        </Animated.View>

        <Animated.View style={[styles.dislikeBadge, { opacity: dislikeOpacity }]}>
          <Text style={[styles.badgeText, styles.dislikeBadgeText]}>NOPE</Text>
        </Animated.View>

        <Image 
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
              Available: {formatAvailability(profiles[currentIndex].availability || [])}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  loadingText: {
    fontSize: 16,
    color: AppStyles.Colors.onSurfaceVariant,
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
  messageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: AppStyles.BorderRadius.l,
    padding: AppStyles.Spacing.l,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: AppStyles.Spacing.m,
    color: AppStyles.Colors.primary,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: AppStyles.Colors.onSurfaceVariant,
  },
  card: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.7,
    borderRadius: AppStyles.BorderRadius.l,
    position: 'absolute',
    backgroundColor: AppStyles.Colors.surface,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: AppStyles.Spacing.xs,
  },
  cardDetails: {
    fontSize: 16,
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
    fontSize: 32,
    fontWeight: 'bold',
    padding: AppStyles.Spacing.s,
    borderWidth: 3,
    borderRadius: AppStyles.BorderRadius.s,
  },
  likeBadgeText: {
    color: AppStyles.Colors.liked,
    borderColor: AppStyles.Colors.liked,
  },
  dislikeBadgeText: {
    color: AppStyles.Colors.disliked,
    borderColor: AppStyles.Colors.disliked,
  },
});