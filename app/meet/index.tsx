import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@/FirebaseConfig';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { User, sampleUser } from '@/models/user';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator } from 'react-native-paper';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;
const SWIPE_THRESHOLD = 120;

// Default profile image
const DEFAULT_PROFILE_IMAGE = require('@/assets/images/bgd.png');

export default function MeetScreen() {
  const [profiles, setProfiles] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Animation values
  const position = new Animated.ValueXY();
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
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
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  
  const dislikeOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });
  
  const nextCardOpacity = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });
  
  const nextCardScale = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp',
  });

  // Pan responder for swipe gestures
  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        // Swipe right (like)
        swipeCard('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        // Swipe left (dislike)
        swipeCard('left');
      } else {
        // Return to center
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: true,
        }).start();
      }
    },
  }), []);

  // Calculate days in common between two availability arrays
  const daysInCommon = (days1: string[], days2: string[]): number => {
    const set1 = new Set(days1);
    return days2.filter(day => set1.has(day)).length;
  };

  // Fetch current user and potential matches
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = FIREBASE_AUTH.currentUser;
        
        if (user) {
          // Fetch current user data
          const userDoc = await getDoc(doc(FIRESTORE_DB, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setCurrentUser(userData);
            
            // Fetch all potential matches
            const usersCollection = collection(FIRESTORE_DB, 'users');
            const usersSnapshot = await getDocs(query(usersCollection));
            
            const potentialMatches = usersSnapshot.docs
              .map(doc => doc.data() as User)
              .filter(potentialMatch => 
                // Filter out current user
                potentialMatch.uid !== user.uid && 
                // Filter based on level preferences
                userData.levelPreference.includes(potentialMatch.level)
              )
              .sort((a, b) => {
                // Sort by availability intersection (days in common)
                const daysInCommonA = daysInCommon(userData.availability, a.availability);
                const daysInCommonB = daysInCommon(userData.availability, b.availability);
                return daysInCommonB - daysInCommonA;
              });
              
            setProfiles(potentialMatches);
          }
        } else {
          // Use sample data if no user is logged in (for development/testing)
          setCurrentUser(sampleUser);
          // Mock profiles based on sample user preferences
          const mockProfiles: User[] = [
            {
              uid: "user1",
              name: "Alex Johnson",
              email: "alex@example.com",
              age: 24,
              gender: "Female",
              level: "Novice",
              levelPreference: ["Novice", "Intermediate"],
              birthdate: null,
              image: null,
              availability: ["Thursday", "Saturday", "Sunday"],
            },
            {
              uid: "user2",
              name: "Sam Wilson",
              email: "sam@example.com",
              age: 28,
              gender: "Male",
              level: "Pro",
              levelPreference: ["Intermediate", "Pro"],
              birthdate: null,
              image: null,
              availability: ["Monday", "Friday"],
            },
            {
              uid: "user3",
              name: "Taylor Reed",
              email: "taylor@example.com",
              age: 25,
              gender: "Non-binary",
              level: "Novice",
              levelPreference: ["Novice"],
              birthdate: null,
              image: null,
              availability: ["Wednesday", "Thursday", "Friday"],
            },
          ];
          
          // Filter and sort mock profiles
          const filteredProfiles = mockProfiles
            .filter(profile => sampleUser.levelPreference.includes(profile.level))
            .sort((a, b) => {
              const daysInCommonA = daysInCommon(sampleUser.availability, a.availability);
              const daysInCommonB = daysInCommon(sampleUser.availability, b.availability);
              return daysInCommonB - daysInCommonA;
            });
            
          setProfiles(filteredProfiles);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset position when currentIndex changes
  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
  }, [currentIndex]);

  const swipeCard = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? width + 100 : -width - 100;
    
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Move to next card after animation completes
      setCurrentIndex(prevIndex => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
      
      // Handle match logic here (for right swipes)
      if (direction === 'right' && profiles[currentIndex]) {
        console.log(`Matched with ${profiles[currentIndex].name}`);
        // Additional match logic could be implemented here
      }
    });
  };
  
  // Format availability days as a readable string
  const formatAvailability = (days: string[]): string => {
    if (days.length === 0) return "Not specified";
    if (days.length <= 3) return days.join(", ");
    return `${days.slice(0, 2).join(", ")} +${days.length - 2} more`;
  };

  // Handle rendering based on loading state and available profiles
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#863f9c" />
        <ThemedText>Finding your matches...</ThemedText>
      </ThemedView>
    );
  }

  if (profiles.length === 0) {
    return (
      <ThemedView style={styles.noMatchesContainer}>
        <ThemedText type="title">No Matches Found</ThemedText>
        <ThemedText>We couldn't find any sports partners matching your preferences.</ThemedText>
      </ThemedView>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <ThemedView style={styles.noMoreMatchesContainer}>
        <ThemedText type="title">No More Matches</ThemedText>
        <ThemedText>You've seen all potential sports partners for now.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Next card (shown underneath current card) */}
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
                Available: {formatAvailability(profiles[currentIndex + 1].availability)}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Current card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.card, rotateAndTranslate]}
      >
        {/* Like badge */}
        <Animated.View
          style={[
            styles.likeBadge,
            { opacity: likeOpacity },
          ]}
        >
          <Text style={styles.badgeText}>LIKE</Text>
        </Animated.View>

        {/* Dislike badge */}
        <Animated.View
          style={[
            styles.dislikeBadge,
            { opacity: dislikeOpacity },
          ]}
        >
          <Text style={styles.badgeText}>NOPE</Text>
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
              Available: {formatAvailability(profiles[currentIndex].availability)}
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  noMoreMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    position: 'absolute',
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
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
    padding: 15,
  },
  cardInfo: {
    alignItems: 'flex-start',
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  cardDetails: {
    fontSize: 18,
    color: 'white',
    marginBottom: 3,
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
    borderColor: '#00FF44',
    color: '#00FF44',
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
  },
});