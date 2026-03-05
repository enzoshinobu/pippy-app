import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, BorderRadius } from '../constants/colors';

interface Props {
  progress: number; // 0-1
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  showLabel?: string;
  animated?: boolean;
  style?: any;
}

export const ProgressBar: React.FC<Props> = ({
  progress,
  height = 12,
  color = Colors.primary,
  backgroundColor = Colors.border,
  showPercentage = false,
  showLabel,
  animated = true,
  style,
}) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  useEffect(() => {
    if (animated) {
      Animated.spring(widthAnim, {
        toValue: clampedProgress,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(clampedProgress);
    }
  }, [clampedProgress, animated]);

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.wrapper, style]}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{showLabel}</Text>
          {showPercentage && (
            <Text style={styles.percentage}>{Math.round(clampedProgress * 100)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.container, { height, backgroundColor }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width,
              backgroundColor: color,
              height: height,
            },
          ]}
        />
        {/* Shine effect */}
        <View style={[styles.shine, { height: height / 3 }]} />
      </View>
    </View>
  );
};

// Circular progress for achievements/stats
export const CircularProgress: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}> = ({
  progress,
  size = 80,
  strokeWidth = 8,
  color = Colors.primary,
  children,
}) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View style={[styles.circularContainer, { width: size, height: size }]}>
      <View style={styles.circularBackground}>
        <View
          style={[
            styles.circularTrack,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: Colors.border,
            },
          ]}
        />
      </View>
      <View style={styles.circularProgress}>
        {/* Simplified circular progress using border */}
        <View
          style={[
            styles.circularFill,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopColor: clampedProgress >= 0.25 ? color : 'transparent',
              borderRightColor: clampedProgress >= 0.5 ? color : 'transparent',
              borderBottomColor: clampedProgress >= 0.75 ? color : 'transparent',
              borderLeftColor: clampedProgress >= 1 ? color : 'transparent',
              transform: [{ rotate: `${clampedProgress * 360 - 90}deg` }],
            },
          ]}
        />
      </View>
      <View style={styles.circularContent}>
        {children}
      </View>
    </View>
  );
};

// Level progress bar
export const LevelProgressBar: React.FC<{
  level: number;
  currentXP: number;
  requiredXP: number;
}> = ({ level, currentXP, requiredXP }) => {
  const progress = currentXP / requiredXP;

  return (
    <View style={styles.levelContainer}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelNumber}>{level}</Text>
      </View>
      <View style={styles.levelBarContainer}>
        <ProgressBar
          progress={progress}
          height={8}
          color={Colors.secondary}
          backgroundColor={Colors.secondaryLight}
        />
        <Text style={styles.xpText}>
          {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  percentage: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  container: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    borderRadius: BorderRadius.full,
  },
  shine: {
    position: 'absolute',
    top: 2,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BorderRadius.full,
  },
  // Circular progress styles
  circularContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularBackground: {
    position: 'absolute',
  },
  circularTrack: {
    backgroundColor: 'transparent',
  },
  circularProgress: {
    position: 'absolute',
  },
  circularFill: {
    backgroundColor: 'transparent',
  },
  circularContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Level progress styles
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textOnPrimary,
  },
  levelBarContainer: {
    flex: 1,
  },
  xpText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
