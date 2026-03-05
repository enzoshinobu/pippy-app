import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Shadows } from '../constants/colors';
import { useApp } from '../context/AppContext';

type TimeRange = 'week' | 'month';

export const StatsScreen: React.FC = () => {
  const { weeklyStats, settings } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const getDaysToShow = () => {
    const days = timeRange === 'week' ? 7 : 30;
    return weeklyStats.slice(-days);
  };

  const stats = getDaysToShow();

  const calculateAverage = (key: 'water' | 'ironTaken' | 'pillDismissed'): string => {
    if (stats.length === 0) return '0';
    
    if (key === 'water') {
      const total = stats.reduce((sum, s) => sum + s.water, 0);
      return (total / stats.length).toFixed(1);
    } else {
      const completed = stats.filter(s => s[key]).length;
      return `${Math.round((completed / stats.length) * 100)}%`;
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getCompletionColor = (stat: typeof stats[0]): string => {
    let score = 0;
    if (stat.water >= settings.waterGoal) score++;
    if (stat.ironTaken) score++;
    if (stat.pillDismissed) score++;
    
    if (score === 3) return Colors.success;
    if (score >= 1) return Colors.warning;
    return Colors.border;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your Stats</Text>

        {/* Time Range Toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleButton, timeRange === 'week' && styles.toggleActive]}
            onPress={() => setTimeRange('week')}
          >
            <Text style={[styles.toggleText, timeRange === 'week' && styles.toggleTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, timeRange === 'month' && styles.toggleActive]}
            onPress={() => setTimeRange('month')}
          >
            <Text style={[styles.toggleText, timeRange === 'month' && styles.toggleTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Averages */}
        <View style={styles.averages}>
          <View style={styles.avgCard}>
            <Text style={styles.avgEmoji}>💧</Text>
            <Text style={styles.avgValue}>{calculateAverage('water')}</Text>
            <Text style={styles.avgLabel}>avg glasses/day</Text>
          </View>
          <View style={styles.avgCard}>
            <Text style={styles.avgEmoji}>💊</Text>
            <Text style={styles.avgValue}>{calculateAverage('ironTaken')}</Text>
            <Text style={styles.avgLabel}>iron days</Text>
          </View>
          <View style={styles.avgCard}>
            <Text style={styles.avgEmoji}>🌸</Text>
            <Text style={styles.avgValue}>{calculateAverage('pillDismissed')}</Text>
            <Text style={styles.avgLabel}>reminder days</Text>
          </View>
        </View>

        {/* Daily Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Breakdown</Text>
          {stats.length === 0 ? (
            <Text style={styles.emptyText}>No data yet. Start tracking today! 🌟</Text>
          ) : (
            stats.slice().reverse().map((stat, index) => (
              <View key={stat.date} style={styles.dayRow}>
                <View style={[styles.dayIndicator, { backgroundColor: getCompletionColor(stat) }]} />
                <View style={styles.dayInfo}>
                  <Text style={styles.dayDate}>{formatDate(stat.date)}</Text>
                  <View style={styles.dayStats}>
                    <Text style={styles.dayStat}>💧 {stat.water}/{settings.waterGoal}</Text>
                    <Text style={styles.dayStat}>💊 {stat.ironTaken ? '✓' : '—'}</Text>
                    <Text style={styles.dayStat}>🌸 {stat.pillDismissed ? '✓' : '—'}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleActive: {
    backgroundColor: Colors.surface,
    ...Shadows.small,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  toggleTextActive: {
    color: Colors.text,
  },
  averages: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  avgCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Shadows.medium,
  },
  avgEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  avgValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  avgLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    ...Shadows.medium,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  dayInfo: {
    flex: 1,
  },
  dayDate: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  dayStats: {
    flexDirection: 'row',
    gap: 16,
  },
  dayStat: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
