import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Shadows, Spacing, BorderRadius } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { useGame } from '../context/GameContext';
import { PippyCharacter, WaterTracker, IronTracker, PillReminder, StarGemsDisplay, ProgressBar } from '../components';
import { PippyMood } from '../types';

export const HomeScreen: React.FC = () => {
  const { daily, settings, isLoading, getTodayProgress, isPerfectDay } = useApp();
  const { wallet, streak, pippy, checkInToday, claimDailyBonus } = useGame();
  const [refreshing, setRefreshing] = React.useState(false);
  const [showDailyBonus, setShowDailyBonus] = React.useState(false);

  // Check in on mount
  useEffect(() => {
    if (!isLoading) {
      checkInToday();
      // Check if daily bonus available
      const today = new Date().toISOString().split('T')[0];
      if (wallet.lastDailyBonus !== today) {
        setShowDailyBonus(true);
      }
    }
  }, [isLoading]);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 5) return 'Night owl';
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  const getPippyMood = (): PippyMood => {
    const hour = new Date().getHours();
    const progress = getTodayProgress();

    // All done = proud
    if (isPerfectDay()) {
      return 'proud';
    }

    // Late at night = sleepy
    if (hour >= 22 || hour < 6) {
      return 'sleepy';
    }

    // Good progress = happy
    if (progress >= 0.66) {
      return 'happy';
    }

    // Behind on water in the evening = worried
    if (hour >= 18 && progress < 0.33) {
      return 'worried';
    }

    // Morning/afternoon cozy vibe
    if (hour >= 6 && hour < 12) {
      return 'cozy';
    }

    return 'happy';
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleClaimDailyBonus = () => {
    const bonus = claimDailyBonus();
    if (bonus > 0) {
      setShowDailyBonus(false);
      // Could show a toast/animation here
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <PippyCharacter mood="happy" size="large" showMessage={false} />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const todayProgress = getTodayProgress();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header with greeting and currency */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {settings.name}!</Text>
            <View style={styles.streakRow}>
              <Text style={styles.streakText}>🔥 {streak.current} day streak</Text>
              {streak.current >= 7 && <Text style={styles.streakBadge}>Week warrior!</Text>}
            </View>
          </View>
          <StarGemsDisplay amount={wallet.starGems} size="medium" />
        </View>

        {/* Daily bonus card */}
        {showDailyBonus && (
          <TouchableOpacity style={styles.dailyBonusCard} onPress={handleClaimDailyBonus}>
            <View style={styles.dailyBonusContent}>
              <Text style={styles.dailyBonusEmoji}>🎁</Text>
              <View>
                <Text style={styles.dailyBonusTitle}>Daily Bonus!</Text>
                <Text style={styles.dailyBonusText}>Tap to claim your rewards</Text>
              </View>
            </View>
            <Text style={styles.dailyBonusArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Pippy */}
        <PippyCharacter 
          mood={getPippyMood()} 
          size="large" 
          onPress={() => {
            // Could show Pippy interaction modal
          }}
        />

        {/* Progress summary */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressPercent}>{Math.round(todayProgress * 100)}%</Text>
          </View>
          <ProgressBar 
            progress={todayProgress} 
            height={10}
            color={isPerfectDay() ? Colors.success : Colors.primary}
          />
          {isPerfectDay() && (
            <View style={styles.perfectDayBadge}>
              <Text style={styles.perfectDayText}>✨ Perfect Day! +25 bonus gems</Text>
            </View>
          )}
        </View>

        {/* Trackers */}
        <View style={styles.trackers}>
          <WaterTracker />
          <IronTracker />
          <PillReminder />
        </View>

        {/* Quick stats */}
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🐾</Text>
            <Text style={styles.statValue}>Lvl {pippy.level}</Text>
            <Text style={styles.statLabel}>Pippy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>{wallet.totalEarned}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{streak.longest}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  streakBadge: {
    fontSize: 11,
    color: Colors.accentDark,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  dailyBonusCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.accent,
    ...Shadows.md,
  },
  dailyBonusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dailyBonusEmoji: {
    fontSize: 32,
  },
  dailyBonusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accentDark,
  },
  dailyBonusText: {
    fontSize: 13,
    color: Colors.accentDark,
    opacity: 0.8,
  },
  dailyBonusArrow: {
    fontSize: 24,
    color: Colors.accentDark,
  },
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  perfectDayBadge: {
    marginTop: Spacing.md,
    backgroundColor: Colors.successLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignSelf: 'flex-start',
  },
  perfectDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
  },
  trackers: {
    gap: 0,
  },
  quickStats: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
