import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { TrackerCard } from './TrackerCard';
import { useApp } from '../context/AppContext';

export const IronTracker: React.FC = () => {
  const { daily, toggleIron } = useApp();
  const { ironTaken } = daily;

  return (
    <TrackerCard
      icon="💊"
      title="Iron Supplement"
      subtitle={ironTaken ? 'Taken ✓' : 'Not taken yet'}
      accentColor={ironTaken ? Colors.success : Colors.iron}
      accentBg={ironTaken ? Colors.successLight : Colors.ironLight}
    >
      <View style={styles.content}>
        <TouchableOpacity
          onPress={toggleIron}
          activeOpacity={0.8}
          style={[
            styles.button,
            ironTaken ? styles.buttonTaken : styles.buttonPending,
          ]}
        >
          <Text style={[
            styles.buttonText,
            ironTaken ? styles.buttonTextTaken : styles.buttonTextPending,
          ]}>
            {ironTaken ? 'Undo' : 'Log Taken'}
          </Text>
        </TouchableOpacity>

        {!ironTaken && (
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              💡 Tip: Take iron on an empty stomach for best absorption. Avoid coffee for 1 hour after.
            </Text>
          </View>
        )}

        {ironTaken && (
          <View style={styles.celebration}>
            <Text style={styles.celebrationText}>
              ✨ Nice! Your body will thank you.
            </Text>
          </View>
        )}
      </View>
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
  },
  buttonPending: {
    backgroundColor: Colors.ironLight,
  },
  buttonTaken: {
    backgroundColor: Colors.successLight,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  buttonTextPending: {
    color: Colors.iron,
  },
  buttonTextTaken: {
    color: Colors.success,
  },
  tip: {
    padding: 12,
    backgroundColor: Colors.warningLight,
    borderRadius: 10,
  },
  tipText: {
    fontSize: 12,
    color: Colors.warning,
    lineHeight: 18,
  },
  celebration: {
    padding: 12,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
  },
  celebrationText: {
    fontSize: 13,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
});
