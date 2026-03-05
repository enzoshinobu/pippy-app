import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Shadows } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { PippyCharacter } from '../components';
import { PippyMood } from '../types';

export const PippyScreen: React.FC = () => {
  const { daily, settings, weeklyStats } = useApp();

  const getPippyMood = (): PippyMood => {
    const { water, ironTaken, pillDismissed } = daily;
    const waterProgress = water / settings.waterGoal;

    if (ironTaken && pillDismissed && waterProgress >= 1) return 'proud';
    if (waterProgress >= 0.5 && (ironTaken || pillDismissed)) return 'happy';
    return 'happy';
  };

  // Calculate streaks
  const calculateStreak = (key: 'water' | 'ironTaken' | 'pillDismissed'): number => {
    let streak = 0;
    const sortedStats = [...weeklyStats].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const stat of sortedStats) {
      const isComplete = key === 'water' 
        ? stat.water >= settings.waterGoal 
        : stat[key];
      
      if (isComplete) streak++;
      else break;
    }
    return streak;
  };

  const waterStreak = calculateStreak('water');
  const ironStreak = calculateStreak('ironTaken');
  const pillStreak = calculateStreak('pillDismissed');

  const getTodaySummary = (): string[] => {
    const summary: string[] = [];
    
    if (daily.water > 0) {
      summary.push(`You've had ${daily.water} glass${daily.water !== 1 ? 'es' : ''} of water`);
    }
    if (daily.ironTaken) {
      summary.push('Iron supplement: ✓');
    }
    if (daily.pillDismissed) {
      summary.push('Pill reminder dismissed');
    }
    
    if (summary.length === 0) {
      summary.push("Let's start tracking today!");
    }
    
    return summary;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Pippy */}
        <View style={styles.pippyContainer}>
          <PippyCharacter mood={getPippyMood()} size="large" showMessage />
        </View>

        {/* Today's Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Summary</Text>
          {getTodaySummary().map((item, index) => (
            <Text key={index} style={styles.summaryItem}>• {item}</Text>
          ))}
        </View>

        {/* Streaks */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Streaks 🔥</Text>
          <View style={styles.streaks}>
            <View style={styles.streak}>
              <Text style={styles.streakEmoji}>💧</Text>
              <Text style={styles.streakCount}>{waterStreak}</Text>
              <Text style={styles.streakLabel}>Water</Text>
            </View>
            <View style={styles.streak}>
              <Text style={styles.streakEmoji}>💊</Text>
              <Text style={styles.streakCount}>{ironStreak}</Text>
              <Text style={styles.streakLabel}>Iron</Text>
            </View>
            <View style={styles.streak}>
              <Text style={styles.streakEmoji}>🌸</Text>
              <Text style={styles.streakCount}>{pillStreak}</Text>
              <Text style={styles.streakLabel}>Pill</Text>
            </View>
          </View>
        </View>

        {/* Fun Message */}
        <View style={[styles.card, styles.messageCard]}>
          <Text style={styles.messageText}>
            {waterStreak + ironStreak + pillStreak >= 10 
              ? "Wow! You're on a roll! Pippy is so proud of you! 🌟"
              : waterStreak + ironStreak + pillStreak >= 5
              ? "Keep it up! You're building great habits! 💪"
              : "Every day is a fresh start. You've got this! 🐾"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  pippyContainer: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Shadows.medium,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  summaryItem: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  streaks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streak: {
    alignItems: 'center',
    padding: 12,
  },
  streakEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  streakCount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
  },
  streakLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  messageCard: {
    backgroundColor: Colors.primaryLight,
  },
  messageText: {
    fontSize: 15,
    color: Colors.primaryDark,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});
