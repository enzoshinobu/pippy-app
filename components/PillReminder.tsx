import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { TrackerCard } from './TrackerCard';
import { useApp } from '../context/AppContext';

export const PillReminder: React.FC = () => {
  const { daily, settings, dismissPill } = useApp();
  const { pillDismissed } = daily;
  const { pillReminderTime } = settings;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <TrackerCard
      icon="🌸"
      title="Pill Reminder"
      subtitle={pillDismissed ? 'Done for today' : `Due at ${formatTime(pillReminderTime)}`}
      accentColor={pillDismissed ? Colors.success : Colors.pill}
      accentBg={pillDismissed ? Colors.successLight : Colors.pillLight}
    >
      {!pillDismissed ? (
        <View style={styles.content}>
          <TouchableOpacity
            onPress={dismissPill}
            activeOpacity={0.8}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Dismiss Reminder</Text>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            This is just a reminder — we don't track whether you took it.
          </Text>
        </View>
      ) : (
        <View style={styles.dismissed}>
          <Text style={styles.dismissedEmoji}>✨</Text>
          <Text style={styles.dismissedText}>
            You're doing great, lovely! Pippy is proud of you. 🐾
          </Text>
        </View>
      )}
    </TrackerCard>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.pillLight,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.pill,
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dismissed: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    gap: 10,
  },
  dismissedEmoji: {
    fontSize: 24,
  },
  dismissedText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryDark,
    fontWeight: '500',
    lineHeight: 20,
  },
});
