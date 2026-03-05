import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/colors';
import { PippyMood } from '../types';

// Import Pippy images
const PIPPY_IMAGES = {
  happy: require('../assets/pippy/pippy-happy.jpg'),
  sad: require('../assets/pippy/pippy-sad.jpg'),
  cozy: require('../assets/pippy/pippy-cozy.jpg'),
  chill: require('../assets/pippy/pippy-chill.jpg'),
  // Map other moods to available images
  sleepy: require('../assets/pippy/pippy-chill.jpg'),
  proud: require('../assets/pippy/pippy-happy.jpg'),
  worried: require('../assets/pippy/pippy-sad.jpg'),
  excited: require('../assets/pippy/pippy-happy.jpg'),
};

const MOOD_MESSAGES: Record<PippyMood, string[]> = {
  happy: [
    "Let's have a great day together! 💕",
    "You're doing amazing! ✨",
    "I'm so happy to see you! 🌸",
  ],
  sleepy: [
    "Rest well, lovely~ 😴",
    "Time for some cozy rest... 🌙",
    "Sweet dreams await! 💤",
  ],
  proud: [
    "You're crushing it today! 🌟",
    "Look at you go! I'm so proud! 👑",
    "You're absolutely incredible! ✨",
  ],
  worried: [
    "Don't forget to take care of yourself! 💭",
    "I'm a little worried... drink some water? 💧",
    "Remember to be kind to yourself today 🤍",
  ],
  excited: [
    "Yay! Something exciting is happening! 🎉",
    "I can't wait! This is going to be great! ⭐",
    "Woohoo! Let's celebrate! 🎊",
  ],
  cozy: [
    "Feeling all warm and cozy~ 🧸",
    "This is so nice and comfy! ☁️",
    "Snuggle time is the best time! 🌸",
  ],
  sad: [
    "I'm here for you... 🤍",
    "It's okay to feel this way 💜",
    "Sending you gentle hugs 🫂",
  ],
};

interface Props {
  mood: PippyMood;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showMessage?: boolean;
  onPress?: () => void;
  animated?: boolean;
  outfit?: string;
}

const sizes = {
  small: { container: 80, image: 70 },
  medium: { container: 140, image: 120 },
  large: { container: 180, image: 160 },
  xlarge: { container: 240, image: 220 },
};

export const PippyCharacter: React.FC<Props> = ({ 
  mood, 
  size = 'medium',
  showMessage = true,
  onPress,
  animated = true,
  outfit,
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const sizeData = sizes[size];
  const message = MOOD_MESSAGES[mood][Math.floor(Math.random() * MOOD_MESSAGES[mood].length)];

  useEffect(() => {
    if (!animated) return;

    // Gentle floating animation
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle glow pulse
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    bounce.start();
    glow.start();

    return () => {
      bounce.stop();
      glow.stop();
    };
  }, [animated]);

  const handlePress = () => {
    // Squish animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  const Container = onPress ? TouchableOpacity : View;

  return (
    <View style={styles.wrapper}>
      <Container onPress={handlePress} activeOpacity={0.9}>
        <Animated.View
          style={[
            styles.container,
            {
              width: sizeData.container,
              height: sizeData.container,
              borderRadius: sizeData.container / 2,
              transform: [
                { translateY: bounceAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glow,
              {
                width: sizeData.container + 20,
                height: sizeData.container + 20,
                borderRadius: (sizeData.container + 20) / 2,
                opacity: glowOpacity,
              },
            ]}
          />
          
          {/* Pippy image */}
          <Image
            source={PIPPY_IMAGES[mood] || PIPPY_IMAGES.happy}
            style={[
              styles.image,
              {
                width: sizeData.image,
                height: sizeData.image,
                borderRadius: sizeData.image / 2,
              },
            ]}
            resizeMode="cover"
          />
          
          {/* Level badge (for larger sizes) */}
          {size !== 'small' && (
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>🐾</Text>
            </View>
          )}
        </Animated.View>
      </Container>
      
      {/* Name label */}
      {size !== 'small' && (
        <Text style={styles.name}>Pippy</Text>
      )}
      
      {/* Message bubble */}
      {showMessage && size !== 'small' && (
        <View style={styles.messageBubble}>
          <Text style={styles.message}>{message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    ...Shadows.lg,
  },
  glow: {
    position: 'absolute',
    backgroundColor: Colors.primary,
  },
  image: {
    borderWidth: 4,
    borderColor: Colors.surface,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  levelText: {
    fontSize: 16,
  },
  name: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  messageBubble: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    maxWidth: 280,
    ...Shadows.sm,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
