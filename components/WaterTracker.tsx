import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { TrackerCard } from './TrackerCard';
import { useApp } from '../context/AppContext';

export const WaterTracker: React.FC = () => {
  const { daily, settings, setWater } = useApp();
  const { water } = daily;
  const { waterGoal } = settings;

  const handleTap = (index: number) => {
    if (index < water) {
      // Tapping filled drop removes it and all after
      setWater(index);
    } else {
      // Tapping empty drop fills up to and including it
      setWater(index + 1);
    }
  };

  const percentage = Math.round((water / waterGoal) * 100);

  return (
    <TrackerCard
      icon="💧"
      title="Water"
      subtitle={`${water}/${waterGoal} glasses · ${percentage}%`}
      accentColor={Colors.water}
      accentBg={Colors.waterLight}
    >
      <View style={styles.dropsContainer}>
        {Array.from({ length: waterGoal }).map((_, i) => {
          const isFilled = i < water;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleTap(i)}
              activeOpacity={0.7}
              style={[
                styles.drop,
                isFilled ? styles.dropFilled : styles.dropEmpty,
              ]}
            >
              <Text style={styles.dropIcon}>
                {isFilled ? '💧' : '○'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {water >= waterGoal && (
        <View style={styles.completeMessage}>
          <Text style={styles.completeText}>🎉 Goal reached! Great job!</Text>
        </View>
      )}
    </TrackerCard>
  );
};

const styles = StyleSheet.create({
  dropsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  drop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropFilled: {
    backgroundColor: Colors.waterLight,
  },
  dropEmpty: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  dropIcon: {
    fontSize: 20,
  },
  completeMessage: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  completeText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '500',
  },
});
