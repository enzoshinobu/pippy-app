import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors, Shadows, BorderRadius } from '../constants/colors';

interface Props {
  amount: number;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  showPlus?: boolean;
  animated?: boolean;
}

export const StarGemsDisplay: React.FC<Props> = ({
  amount,
  size = 'medium',
  onPress,
  showPlus = false,
  animated = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const prevAmount = useRef(amount);

  useEffect(() => {
    if (!animated) return;

    // Animate when amount increases
    if (amount > prevAmount.current) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }
    prevAmount.current = amount;
  }, [amount, animated]);

  const sizes = {
    small: { container: 28, fontSize: 12, icon: 14, padding: 6 },
    medium: { container: 36, fontSize: 15, icon: 18, padding: 10 },
    large: { container: 44, fontSize: 18, icon: 22, padding: 14 },
  };

  const sizeData = sizes[size];
  const Container = onPress ? TouchableOpacity : View;

  const glowStyle = {
    shadowColor: Colors.starGem,
    shadowOpacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 0.8],
    }),
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [4, 16],
    }),
  };

  return (
    <Container onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.container,
          {
            height: sizeData.container,
            paddingHorizontal: sizeData.padding,
            transform: [{ scale: scaleAnim }],
          },
          glowStyle,
        ]}
      >
        <Text style={[styles.icon, { fontSize: sizeData.icon }]}>⭐</Text>
        <Text style={[styles.amount, { fontSize: sizeData.fontSize }]}>
          {showPlus && amount > 0 ? '+' : ''}{amount.toLocaleString()}
        </Text>
      </Animated.View>
    </Container>
  );
};

// Floating gem animation for rewards
export const FloatingGem: React.FC<{
  amount: number;
  startPosition: { x: number; y: number };
  onComplete: () => void;
}> = ({ amount, startPosition, onComplete }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(onComplete);
  }, []);

  return (
    <Animated.View
      style={[
        styles.floatingGem,
        {
          left: startPosition.x,
          top: startPosition.y,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <Text style={styles.floatingText}>+{amount} ⭐</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.starGemGlow,
    borderRadius: BorderRadius.full,
    gap: 4,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.starGem,
  },
  icon: {
    marginRight: 2,
  },
  amount: {
    fontWeight: '700',
    color: Colors.accentDark,
  },
  floatingGem: {
    position: 'absolute',
    backgroundColor: Colors.starGemGlow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    ...Shadows.md,
  },
  floatingText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accentDark,
  },
});
